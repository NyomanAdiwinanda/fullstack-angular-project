import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ApiItemResponse, ApiListResponse, ImageItem } from '../types/image';

const API_BASE = 'https://fullstack-angular-project.onrender.com';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private http = inject(HttpClient);

  async health(): Promise<any> {
    return firstValueFrom(this.http.get(`${API_BASE}/health`));
  }

  async list(params?: {
    page?: number;
    limit?: number;
    mimeType?: string;
    tags?: string;
  }): Promise<ApiListResponse<ImageItem>> {
    const search = new URLSearchParams();
    if (params?.page) search.set('page', String(params.page));
    if (params?.limit) search.set('limit', String(params.limit));
    if (params?.mimeType) search.set('mimeType', params.mimeType);
    if (params?.tags) search.set('tags', params.tags);
    const qs = search.toString();
    const url = `${API_BASE}/api/images${qs ? `?${qs}` : ''}`;
    return firstValueFrom(this.http.get<ApiListResponse<ImageItem>>(url));
  }

  async get(id: string): Promise<ApiItemResponse<ImageItem>> {
    return firstValueFrom(
      this.http.get<ApiItemResponse<ImageItem>>(`${API_BASE}/api/images/${id}`)
    );
  }

  async upload(payload: {
    file: File;
    title?: string;
    description?: string;
    tags?: string;
  }): Promise<ApiItemResponse<ImageItem>> {
    const form = new FormData();
    form.append('image', payload.file);
    if (payload.title) form.append('title', payload.title);
    if (payload.description) form.append('description', payload.description);
    if (payload.tags) form.append('tags', payload.tags); // comma-separated
    return firstValueFrom(
      this.http.post<ApiItemResponse<ImageItem>>(`${API_BASE}/api/images/upload`, form)
    );
  }

  async update(
    id: string,
    payload: { title?: string; description?: string; tags?: string[] | string }
  ): Promise<ApiItemResponse<ImageItem>> {
    return firstValueFrom(
      this.http.patch<ApiItemResponse<ImageItem>>(`${API_BASE}/api/images/${id}`, payload)
    );
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return firstValueFrom(
      this.http.delete<{ success: boolean; message: string }>(`${API_BASE}/api/images/${id}`)
    );
  }
}
