import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tourist-place',
  imports: [CommonModule],
  templateUrl: './tourist-place.component.html',
  styleUrl: './tourist-place.component.scss'
})
export class TouristPlaceComponent implements OnInit {
  placeId!: string;
 place: any;
  isLoading = true;
activeImage: string | null = null;
activeIndex = 0;
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.placeId = this.route.snapshot.paramMap.get('id')!;
    this.http.get(`http://127.0.0.1:8000/api/places/${this.placeId}`).subscribe(data => {
      this.place = data;
      this.isLoading = false;
    });
  }
  getRatingStars(rating: any): number[] {
    const numericRating = parseFloat(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const starValue = numericRating - i;
      stars.push(starValue >= 1 ? 1 : starValue > 0 ? starValue : 0);
    }
    return stars;
  }
}
