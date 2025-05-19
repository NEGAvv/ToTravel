import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TouristPlaceCardComponent } from '../../components/tourist-place-card/tourist-place-card.component';

@Component({
  selector: 'app-saved-places',
  imports: [CommonModule, TouristPlaceCardComponent],
  templateUrl: './saved-places.component.html',
  styleUrl: './saved-places.component.scss'
})
export class SavedPlacesComponent  implements OnInit {
  isLoading = true;
  savedPlaces: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadSavedPlaces();
  }

  loadSavedPlaces(): void {
    this.isLoading = true;
    this.http.get<any[]>('http://127.0.0.1:8000/api/savedPlaces').subscribe({
      next: (places) => {
        console.log('Received places:', places);
        this.savedPlaces = places;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading saved places:', err);
        this.isLoading = false;
      }
    });
  }

  explorePlaces(): void {
    this.router.navigate(['/places']);
  }
}
