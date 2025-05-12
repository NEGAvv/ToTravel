import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TouristPlaceCardComponent } from '../../components/tourist-place-card/tourist-place-card.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TouristPlaceCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  touristPlaces: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/places')
      .subscribe({
        next: data => this.touristPlaces = data,
        error: err => console.error('Failed to load places:', err)
      });
  }
}
