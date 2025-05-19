import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristPlaceDetailsComponent } from './tourist-place-details.component';

describe('TouristPlaceDetailsComponent', () => {
  let component: TouristPlaceDetailsComponent;
  let fixture: ComponentFixture<TouristPlaceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristPlaceDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristPlaceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
