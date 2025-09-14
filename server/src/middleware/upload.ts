import multer from "multer";
import { Request } from "express";
import { createError } from "./errorHandler";

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
	const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(",") || [
		"image/jpeg",
		"image/png",
		"image/gif",
		"image/webp",
	];

	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(createError(`File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(", ")}`, 400));
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760"),
		files: 1,
	},
});

export const uploadSingle = upload.single("image");

export const handleMulterError = (error: any, req: Request, res: any, next: any) => {
	if (error instanceof multer.MulterError) {
		if (error.code === "LIMIT_FILE_SIZE") {
			return res.status(400).json({
				success: false,
				message: "File too large. Maximum size is 5MB.",
			});
		}
		if (error.code === "LIMIT_FILE_COUNT") {
			return res.status(400).json({
				success: false,
				message: "Too many files. Only one file is allowed.",
			});
		}
		if (error.code === "LIMIT_UNEXPECTED_FILE") {
			return res.status(400).json({
				success: false,
				message: 'Unexpected field name. Use "image" as the field name.',
			});
		}
	}
	next(error);
};
