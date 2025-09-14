import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent implements OnInit {
  private imageService = inject(ImageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  protected id!: string;
  protected loading = signal(true);
  protected busy = signal(false);
  protected error = signal<string | null>(null);

  form = this.fb.group({
    title: [''],
    description: [''],
    tags: [''],
  });

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    try {
      this.loading.set(true);
      const res = await this.imageService.get(this.id);
      const item = res.data;
      this.form.patchValue({
        title: item.title || '',
        description: item.metadata?.description || '',
        tags: (item.metadata?.tags || []).join(','),
      });
    } catch (e: any) {
      this.error.set(e?.message || 'Failed to load');
    } finally {
      this.loading.set(false);
    }
  }

  async onSubmit() {
    try {
      this.busy.set(true);
      const v = this.form.value;
      const payload = {
        title: v.title || undefined,
        description: v.description || undefined,
        tags: (v.tags || '') as string,
      };

      await this.imageService.update(this.id, payload);
      this.router.navigate(['/images', this.id]);
    } catch (e: any) {
      this.error.set(e?.message || 'Update failed');
    } finally {
      this.busy.set(false);
    }
  }
}
