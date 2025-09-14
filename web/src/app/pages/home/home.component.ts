import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImageService } from '../../services/image.service';
import { ImageItem } from '../../types/image';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private imageService = inject(ImageService);
  protected images = signal<ImageItem[]>([]);
  protected loading = signal<boolean>(true);
  protected error = signal<string | null>(null);

  ngOnInit() {
    this.fetch();
  }

  async fetch() {
    try {
      this.loading.set(true);
      const res = await this.imageService.list({ page: 1, limit: 24 });
      this.images.set(res.data);
      this.error.set(null);
    } catch (e: any) {
      this.error.set(e?.message || 'Failed to load');
    } finally {
      this.loading.set(false);
    }
  }

  trackId = (_: number, it: ImageItem) => it.id;

  firstTags(img: ImageItem): string[] {
    const tags = img.metadata?.tags || [];
    return tags.slice(0, 2);
  }

  extraTagCount(img: ImageItem): number {
    const tags = img.metadata?.tags || [];
    return tags.length > 2 ? tags.length - 2 : 0;
  }
}
