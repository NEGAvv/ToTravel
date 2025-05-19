import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReviewComponent } from '../review/review.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-list',
  imports: [RouterModule, ReviewComponent, CommonModule],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss'
})
export class ReviewListComponent {
   @Input() reviews: any[] = [];
   @Input() placeId!: number;
  
  @Output() like = new EventEmitter<any>();

  onToggleLike(review: any) {
    this.like.emit(review);
  }
  handleCommentAdded(newComment: any) {
  const review = this.reviews.find(r => r.id === newComment.review_id);
  if (review) {
    if (!review.comments) {
      review.comments = [];
    }
    review.comments.push(newComment);
  }
}
handleCommentDeleted(commentId: number) {
  const review = this.reviews.find(r => r.comments.some((c: any) => c.id === commentId));
  if (review) {
    review.comments = review.comments.filter((c: any) => c.id !== commentId);
  }
}

handleReviewDeleted(reviewId: number) {
  this.reviews = this.reviews.filter(r => r.id !== reviewId);
}

handleReviewUpdated(updatedReview: any) {
  const index = this.reviews.findIndex(r => r.id === updatedReview.id);
  if (index !== -1) {
    this.reviews[index] = {
      ...this.reviews[index], 
      ...updatedReview,      
      user: updatedReview.user || this.reviews[index].user
    };
  }
}
}
