import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-review',
  imports: [CommonModule, FormsModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);

  isLoading: boolean = true;
  placeId = +this.route.snapshot.paramMap.get('id')!;
  place: any = {
    name: '',
    address_string: '',
    country: '',
    original_url: '',
  };

  reviewText = '';
  rating = 0;

  constructor() {
    this.loadPlace();
  }

   loadPlace() {
    this.http.get(`http://127.0.0.1:8000/api/places/${this.placeId}`).subscribe({
      next: (data: any) => {
        this.place = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Помилка при завантаженні місця', error);
        this.isLoading = false; 
      }
    });
  }

  submitReview() {
    const body = {
      rating: this.rating,
      review_text: this.reviewText,
    };

    this.http.post(`http://127.0.0.1:8000/api/places/${this.placeId}/reviews`, body).subscribe({
      next: () => {
        console.log('Review submitted!');
        this.router.navigate(['/places', this.placeId]);
      },
      error: (err) => {
        console.error(err);
        console.log('Failed to submit review');
      }
    });
  }
}
