import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HotelBookingPage } from './music.page';

describe('HotelBookingPage', () => {
  let component: HotelBookingPage;
  let fixture: ComponentFixture<HotelBookingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
