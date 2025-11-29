import { Routes } from '@angular/router';
import { DrawerPage } from './drawer.page';
import { ServicePage } from './service/service.page';

export const routes: Routes = [
  {
    path: 'menu',
    component: DrawerPage,
    children: [
      
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },

      {
        path: 'service',
        loadComponent: () => import('./service/service.page').then((m) => m.ServicePage),
      },
      {
        path: 'demo',
        loadComponent: () => import('./demo/demo.page').then((m) => m.DemoPage),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./contact/contact.page').then(
            (m) => m.ContactPage
          ),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'menu/home', pathMatch: 'full' },
];
