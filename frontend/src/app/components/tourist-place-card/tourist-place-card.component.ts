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
    if (this.rating === null) return 'N/A';
    return this.rating.toFixed(1);
  }

  getRatingStars(): number[] {
  if (!this.hasRating) return [];
  
  const fullStars = Math.floor(this.rating as number);
  const decimalPart = (this.rating as number) - fullStars;
  const stars = Array(5).fill(0);
  
  for (let i = 0; i < fullStars; i++) {
    stars[i] = 1;
  }
  
  if (decimalPart > 0 && fullStars < 5) {
    stars[fullStars] = decimalPart;
  }
  
  return stars;
}

  getSafeCategories(): string[] {
    return Array.isArray(this.categories) ? this.categories : [];
  }
  
  Math = Math;
}
