export interface IImage {
	_id?: string;
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

export interface IImageUploadResponse {
	success: boolean;
	message: string;
	data?: IImage;
	error?: string;
}

export interface IImageListResponse {
	success: boolean;
	message: string;
	data?: IImage[];
	pagination?: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
	error?: string;
}
