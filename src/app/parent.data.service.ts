import { Injectable } from '@angular/core';
import { DemoPage } from './drawer/demo/demo.page';
import { ViewMusicPage } from './view-music/view-music.page';

@Injectable({
  providedIn: 'root'
})
export class ParentDataService {

  demoPage?: DemoPage;
  viewMusicPage?:ViewMusicPage;
  constructor() { }
}
