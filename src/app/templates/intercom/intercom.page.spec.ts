import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntercomPage } from './intercom.page';

describe('IntercomPage', () => {
  let component: IntercomPage;
  let fixture: ComponentFixture<IntercomPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IntercomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
