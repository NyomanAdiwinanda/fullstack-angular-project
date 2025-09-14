import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CreateComponent {
  private fb = inject(FormBuilder);
  private imageService = inject(ImageService);
  private router = inject(Router);

  protected busy = signal(false);
  protected error = signal<string | null>(null);
  protected fileError = signal<string | null>(null);
  protected file: File | null = null;

  form = this.fb.group({
    title: [''],
    description: [''],
    tags: [''],
  });

  onFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files?.[0] || null;
    this.file = f;
    if (!f) {
      this.fileError.set('Please select an image.');
      return;
    }
    if (!f.type.startsWith('image/')) {
      this.fileError.set('File must be an image.');
      this.file = null;
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      this.fileError.set('Max size is 5MB.');
      this.file = null;
      return;
    }
    this.fileError.set(null);
  }

  async onSubmit() {
    if (!this.file) {
      this.fileError.set('Please select an image.');
      return;
    }
    try {
      this.busy.set(true);
      const { title, description, tags } = this.form.value;
      const res = await this.imageService.upload({
        file: this.file,
        title: title || undefined,
        description: description || undefined,
        tags: tags || '',
      });
      this.router.navigate(['/images', res.data.id]);
    } catch (e: any) {
      this.error.set(e?.message || 'Upload failed');
    } finally {
      this.busy.set(false);
    }
  }
}
