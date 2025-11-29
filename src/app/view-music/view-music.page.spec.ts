import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewMusicPage } from './view-music.page';

describe('ViewMusicPage', () => {
  let component: ViewMusicPage;
  let fixture: ComponentFixture<ViewMusicPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMusicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
