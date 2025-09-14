import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
	},
	{
		path: 'upload',
		loadComponent: () => import('./pages/create/create.component').then(m => m.CreateComponent)
	},
	{
		path: 'images/:id',
		loadComponent: () => import('./pages/detail/detail.component').then(m => m.DetailComponent)
	},
	{
		path: 'images/:id/edit',
		loadComponent: () => import('./pages/edit/edit.component').then(m => m.EditComponent)
	},
	{ path: '**', redirectTo: '' }
];
