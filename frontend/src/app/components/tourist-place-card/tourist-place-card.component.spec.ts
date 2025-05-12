import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristPlaceCardComponent } from './tourist-place-card.component';

describe('TouristPlaceCardComponent', () => {
  let component: TouristPlaceCardComponent;
  let fixture: ComponentFixture<TouristPlaceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristPlaceCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristPlaceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
