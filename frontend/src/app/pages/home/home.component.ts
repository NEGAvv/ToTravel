import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TouristPlaceCardComponent } from '../../components/tourist-place-card/tourist-place-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TouristPlaceCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  touristPlaces: any[] = [];
  recommendedPlaces: any[] = [];
  isLoading = true;
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
  this.loadAllPlaces();
  this.loadRecommendations();
}

loadAllPlaces(): void {
  this.http.get<any[]>('http://127.0.0.1:8000/api/places')
    .subscribe({
      next: data => {
        this.touristPlaces = data;
        this.isLoading = false;
        console.log("PLACES");
        console.log(this.touristPlaces);
      },
      error: err => console.error('Failed to load places:', err)
    });
}

loadRecommendations(): void {
  this.http.get<any>('http://127.0.0.1:8000/api/user/preferences/recommendations')
    .subscribe({
      next: response => {
        this.recommendedPlaces = response.data;
        this.isLoading = false;
        console.log("RECCOMENDATIONS");
        console.log(this.recommendedPlaces);
      },
      error: err => {
        console.warn('No recommendations:', err);
        this.recommendedPlaces = [];
      }
    });
}

goToSurvey() {
  this.router.navigate(['/survey']);
}
}
