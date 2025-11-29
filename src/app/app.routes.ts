import { Routes } from '@angular/router';
import { DrawerPage } from './drawer/drawer.page';

export const routes: Routes = [
  {
    path: '',
   
    loadChildren: () => import('./drawer/drawer.routes').then((m) => m.routes),
  },
  {
    path: 'music',
    loadComponent: () =>
      import('./templates/music/music.page').then(
        (m) => m.MusicPage
      ),
  },
  {
    path: 'light',
    loadComponent: () =>
      import('./templates/light/light.page').then(
        (m) => m.LightPage
      ),
  },
  {
    path: 'theater',
    loadComponent: () => import('./templates/theater/theater.page').then( m => m.TheaterPage)
  },
  {
    path: 'camera',
    loadComponent: () => import('./templates/camera/camera.page').then( m => m.CameraPage)
  },
  {
    path: 'intercom',
    loadComponent: () => import('./templates/intercom/intercom.page').then( m => m.IntercomPage)
  },
  {
    path: 'view-camera',
    loadComponent: () => import('./view-camera/view-camera.page').then( m => m.ViewCameraPage)
  },
  {
    path: 'view-light',
    loadComponent: () => import('./view-light/view-light.page').then( m => m.ViewLightPage)
  },
  {
    path: 'view-door',
    loadComponent: () => import('./view-door/view-door.page').then( m => m.ViewDoorPage)
  },
  {
    path: 'view-blind',
    loadComponent: () => import('./view-blind/view-blind.page').then( m => m.ViewBlindPage)
  },
  {
    path: 'view-music',
    loadComponent: () => import('./view-music/view-music.page').then( m => m.ViewMusicPage)
  },
];
