export interface ImageItemMeta {
  description?: string;
  tags?: string[];
}

export interface ImageItem {
  id: string;
  title: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  s3Key: string;
  s3Url: string;
  url?: string;
  uploadDate: string | Date;
  metadata?: ImageItemMeta;
}

export interface ApiListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiItemResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
