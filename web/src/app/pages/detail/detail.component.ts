import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ImageService } from '../../services/image.service';
import { ImageItem } from '../../types/image';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {
  private imageService = inject(ImageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected item = signal<ImageItem | null>(null);
  protected loading = signal<boolean>(true);
  protected busy = signal<boolean>(false);
  protected error = signal<string | null>(null);
  protected showDelete = signal<boolean>(false);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    await this.load(id);
  }

  async load(id: string) {
    try {
      this.loading.set(true);
      const res = await this.imageService.get(id);
      this.item.set(res.data);
      this.error.set(null);
    } catch (e: any) {
      this.error.set(e?.message || 'Failed to load');
    } finally {
      this.loading.set(false);
    }
  }

  openDelete() {
    this.showDelete.set(true);
  }

  closeDelete() {
    if (this.busy()) return;
    this.showDelete.set(false);
  }

  async confirmDelete(id: string) {
    try {
      this.busy.set(true);
      await this.imageService.delete(id);
      this.router.navigateByUrl('/');
    } catch (e: any) {
      this.error.set(e?.message || 'Delete failed');
    } finally {
      this.busy.set(false);
      this.showDelete.set(false);
    }
  }

  protected formatSize(bytes?: number | null): string {
    if (bytes == null || isNaN(bytes)) return '-';
    const thresh = 1024;
    if (bytes < thresh) return bytes + ' B';
    const units = ['KB', 'MB', 'GB', 'TB'];
    let u = -1;
    let value = bytes;
    do {
      value /= thresh;
      ++u;
    } while (value >= thresh && u < units.length - 1);
    return value.toFixed(value >= 100 || value >= 10 ? 1 : 2) + ' ' + units[u];
  }
}
