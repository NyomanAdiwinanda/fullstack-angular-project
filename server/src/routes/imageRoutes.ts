import { Router, Request, Response, NextFunction } from "express";
import Image from "../models/Image";
import { uploadSingle, handleMulterError } from "../middleware/upload";
import { uploadToS3, generateS3Key, getSignedUrl, deleteFromS3 } from "../services/s3Service";
import { createError } from "../middleware/errorHandler";
import { IImageUploadResponse, IImageListResponse } from "../types/image.types";

const router = Router();

router.post("/upload", uploadSingle, handleMulterError, async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.file) {
			throw createError("No file uploaded", 400);
		}

		const { originalname, mimetype, size, buffer } = req.file;
		const s3Key = generateS3Key(originalname);

		// Upload to S3
		const s3Result = await uploadToS3(buffer, s3Key, mimetype);

		// Save metadata to MongoDB
		const image = new Image({
			title: req.body.title || originalname,
			filename: s3Key.split("/").pop(),
			originalName: originalname,
			mimeType: mimetype,
			size,
			s3Key,
			s3Url: s3Result.Location,
			metadata: {
				description: req.body.description,
				tags: req.body.tags ? req.body.tags.split(",").map((tag: string) => tag.trim()) : [],
			},
		});

		await image.save();

		const response: IImageUploadResponse = {
			success: true,
			message: "Image uploaded successfully",
			data: image.toJSON() as any,
		};

		res.status(201).json(response);
	} catch (error) {
		next(error);
	}
});

// Get all images with pagination
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;
		const skip = (page - 1) * limit;

		// Build query filters
		const query: any = {};

		if (req.query.mimeType) {
			query.mimeType = req.query.mimeType;
		}

		if (req.query.tags) {
			const tags = (req.query.tags as string).split(",").map(tag => tag.trim());
			query["metadata.tags"] = { $in: tags };
		}

		const [images, total] = await Promise.all([
			Image.find(query).sort({ uploadDate: -1 }).skip(skip).limit(limit).lean(),
			Image.countDocuments(query),
		]);

		// Use direct S3 URLs since bucket is public
		const imagesWithUrls = images.map(image => ({
			...image,
			url: image.s3Url,
			id: image._id,
		}));

		const response: IImageListResponse = {
			success: true,
			message: "Images retrieved successfully",
			data: imagesWithUrls as any,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		};

		res.json(response);
	} catch (error) {
		next(error);
	}
});

// Get single image by ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const image = await Image.findById(req.params.id);

		if (!image) {
			throw createError("Image not found", 404);
		}

		const imageWithUrl = {
			...image.toJSON(),
			url: image.s3Url,
		};

		const response: IImageUploadResponse = {
			success: true,
			message: "Image retrieved successfully",
			data: imageWithUrl as any,
		};

		res.json(response);
	} catch (error) {
		next(error);
	}
});

// Delete image
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const image = await Image.findById(req.params.id);

		if (!image) {
			throw createError("Image not found", 404);
		}

		// Delete from S3
		await deleteFromS3(image.s3Key);

		// Delete from MongoDB
		await Image.findByIdAndDelete(req.params.id);

		res.json({
			success: true,
			message: "Image deleted successfully",
		});
	} catch (error) {
		next(error);
	}
});

// Update image metadata
router.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { title, description, tags } = req.body;

		const updateData: any = {};
		if (title !== undefined) {
			updateData.title = title;
		}
		if (description !== undefined) {
			updateData["metadata.description"] = description;
		}
		if (tags !== undefined) {
			updateData["metadata.tags"] = Array.isArray(tags) ? tags : tags.split(",").map((tag: string) => tag.trim());
		}

		const image = await Image.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

		if (!image) {
			throw createError("Image not found", 404);
		}

		const response: IImageUploadResponse = {
			success: true,
			message: "Image metadata updated successfully",
			data: image.toJSON() as any,
		};

		res.json(response);
	} catch (error) {
		next(error);
	}
});

export default router;
