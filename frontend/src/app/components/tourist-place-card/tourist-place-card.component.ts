import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tourist-place-card',
  imports: [CommonModule],
  templateUrl: './tourist-place-card.component.html',
  styleUrl: './tourist-place-card.component.scss'
})
export class TouristPlaceCardComponent {
 @Input() place!: any;

  get imageUrl(): string {
    return this.place.photos?.[0]?.medium_url || 'https://via.placeholder.com/300x200?text=No+Image';
  }

  get categories(): string[] {
    return this.place.categories?.map((c: any) => c.name) || [];
  }

  get location(): string {
    return this.place.address_string || this.place.country || 'Unknown';
  }

   get likes(): string {
    return this.place.likes_count || 0;
  }

  get rating(): number | null {
    const rating = this.place.rating;
    if (rating === null || rating === undefined) return null;
    const num = Number(rating);
    return isNaN(num) ? null : num;
  }

  get hasRating(): boolean {
    return this.rating !== null;
  }

 getFormattedRating(): string {
    return this.rating !== null ? this.rating.toFixed(1) : 'N/A';
  }

  getRatingStars(): number[] {
    const r = this.rating;
    if (r === null) return [];

    const stars = [];
    for (let i = 0; i < 5; i++) {
      const diff = r - i;
      stars.push(diff >= 1 ? 1 : diff > 0 ? diff : 0);
    }
    return stars;
  }


  getSafeCategories(): string[] {
    return Array.isArray(this.categories) ? this.categories : [];
  }
  
  Math = Math;
}
