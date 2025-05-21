import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristPlacesTableComponent } from './tourist-places-table.component';

describe('TouristPlacesTableComponent', () => {
  let component: TouristPlacesTableComponent;
  let fixture: ComponentFixture<TouristPlacesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristPlacesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristPlacesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
