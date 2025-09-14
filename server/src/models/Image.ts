import mongoose, { Schema, Document } from "mongoose";

export interface IImageDocument extends Document {
	title: string;
	filename: string;
	originalName: string;
	mimeType: string;
	size: number;
	s3Key: string;
	s3Url: string;
	uploadDate: Date;
	metadata?: {
		width?: number;
		height?: number;
		description?: string;
		tags?: string[];
	};
}

const ImageSchema: Schema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		filename: {
			type: String,
			required: true,
			trim: true,
		},
		originalName: {
			type: String,
			required: true,
			trim: true,
		},
		mimeType: {
			type: String,
			required: true,
			enum: ["image/jpeg", "image/png", "image/gif", "image/webp"],
		},
		size: {
			type: Number,
			required: true,
			min: 0,
		},
		s3Key: {
			type: String,
			required: true,
			unique: true,
		},
		s3Url: {
			type: String,
			required: true,
		},
		uploadDate: {
			type: Date,
			default: Date.now,
		},
		metadata: {
			width: {
				type: Number,
				min: 0,
			},
			height: {
				type: Number,
				min: 0,
			},
			description: {
				type: String,
				trim: true,
				maxlength: 500,
			},
			tags: [
				{
					type: String,
					trim: true,
					lowercase: true,
				},
			],
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform: function (doc: any, ret: any) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.__v;
				return ret;
			},
		},
	}
);

// Index for efficient queries
ImageSchema.index({ uploadDate: -1 });
ImageSchema.index({ mimeType: 1 });
ImageSchema.index({ "metadata.tags": 1 });

export default mongoose.model<IImageDocument>("Image", ImageSchema);
