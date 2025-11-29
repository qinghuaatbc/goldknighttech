import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewCameraPage} from './view-camera.page';

describe('LightSettingPage', () => {
  let component: ViewCameraPage;
  let fixture: ComponentFixture<ViewCameraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCameraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
