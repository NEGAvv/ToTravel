import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tourist-place-details',
  imports: [CommonModule],
  templateUrl: './tourist-place-details.component.html',
  styleUrl: './tourist-place-details.component.scss'
})
export class TouristPlaceDetailsComponent {
  @Input() place: any;
  @Input() isLiked: boolean = false;
  @Input() activeImage: string | null = null;

  @Output() likeToggled = new EventEmitter<void>();
  @Output() imageChanged = new EventEmitter<string>();

  getRatingStars(rating: any): number[] {
    const numericRating = parseFloat(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const starValue = numericRating - i;
      stars.push(starValue >= 1 ? 1 : starValue > 0 ? starValue : 0);
    }
    return stars;
  }

  onImageClick(imageUrl: string) {
    this.imageChanged.emit(imageUrl);
  }

  onLikeToggle() {
    this.likeToggled.emit();
  }
}
