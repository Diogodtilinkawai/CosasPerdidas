import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },  {
    path: 'sign',
    loadComponent: () => import('./sign/sign.page').then( m => m.SignPage)
  },
  {
    path: 'forgot',
    loadComponent: () => import('./forgot/forgot.page').then( m => m.ForgotPage)
  },
  {
    path: 'cosas',
    loadComponent: () => import('./cosas/cosas.page').then( m => m.CosasPage)
  },




];
