import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristPlaceComponent } from './tourist-place.component';

describe('TouristPlaceComponent', () => {
  let component: TouristPlaceComponent;
  let fixture: ComponentFixture<TouristPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristPlaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
