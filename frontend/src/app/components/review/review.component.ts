import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentComponent } from '../comment/comment.component';
import { ReviewListComponent } from '../review-list/review-list.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-review',
  imports: [CommonModule, CommentComponent, RouterModule, FormsModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
   animations: [
    trigger('editFormAnimation', [
      state('void', style({
        opacity: 0,
        height: 0,
        padding: 0,
        margin: 0
      })),
      state('*', style({
        opacity: 1,
        height: '*',
        padding: '*',
        margin: '*'
      })),
      transition('void <=> *', animate('200ms ease-in-out'))
    ]),

    trigger('commentAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(-10px)' }))
      ])
    ]),

    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-10px)' }),
          stagger('100ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
trigger('fadeInOut', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('200ms ease-out', style({ opacity: 1 }))
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ opacity: 0 }))
    ])
  ]),
    trigger('buttonHover', [
      state('normal', style({
        transform: 'scale(1)'
      })),
      state('hovered', style({
        transform: 'scale(1.05)'
      })),
      transition('normal <=> hovered', animate('150ms ease-in-out'))
    ])
  ]
})
export class ReviewComponent {
  @Input() review: any;
  @Input() placeId!: number;
  @Output() like = new EventEmitter<any>();
  @Output() commentAdded = new EventEmitter<any>();
  @Output() commentDeleted = new EventEmitter<number>();
  @Output() reviewDeleted = new EventEmitter<number>();
  @Output() reviewUpdated = new EventEmitter<any>();

  currentUserId: number | null = null;
  showCommentForm = false;
  showEditForm = false;
  newComment = '';
  editedReviewText = '';
  editedRating = 0;
  isSubmitting = false;
 buttonState: { [key: string]: string } = {};

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getUser().subscribe({
      next: (user) => {
        this.currentUserId = user.data.id;
      },
      error: () => {
        this.currentUserId = null;
      }
    });
  }

   onCommentAnimationDone(event: AnimationEvent) {
    console.debug('Animation event:', event);
  }

   onButtonHover(buttonId: string, isHovered: boolean) {
    this.buttonState[buttonId] = isHovered ? 'hovered' : 'normal';
  }
  
  toggleLike() {
    this.like.emit(this.review);
  }

  toggleCommentForm() {
    this.showCommentForm = !this.showCommentForm;
  }

  submitComment() {
    if (!this.newComment.trim()) return;
    
    this.isSubmitting = true;
    const commentData = {
      review_id: this.review.id,
      comment_text: this.newComment
    };

    this.http.post(`http://127.0.0.1:8000/api/reviews/${this.review.id}/comments`, commentData)
      .subscribe({
        next: (response: any) => {
          this.newComment = '';
          this.showCommentForm = false;
          this.commentAdded.emit(response);
        },
        error: (error) => {
          console.error('Error adding comment:', error);
        },
        complete: () => {
          this.isSubmitting = false;
        }
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
  
handleDeleteComment(commentId: number) {
    this.authService.getUser().subscribe({
      next: () => {
        this.http.delete(`${this.authService.apiUrl}/comments/${commentId}`, {
          headers: this.getAuthHeaders()
        }).subscribe({
          next: () => {
            this.commentDeleted.emit(commentId);
          },
          error: (error) => {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment');
          }
        });
      },
      error: () => {
        alert('You need to be logged in to delete comments');
      }
    });
  }

  private getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.authService.token.getToken()}`
    };
  }


  get canEditReview(): boolean {
    return this.currentUserId === this.review.user?.id;
  }

  toggleEditForm() {
    this.showEditForm = !this.showEditForm;
    if (this.showEditForm) {
      this.editedReviewText = this.review.review_text;
      this.editedRating = this.review.rating;
    }
  }

  submitEdit() {
  if (!this.editedReviewText.trim() || this.editedRating < 1 || this.editedRating > 5) return;

  this.isSubmitting = true;
  const reviewData = {
    review_text: this.editedReviewText,
    rating: this.editedRating
  };

  this.http.put(`${this.authService.apiUrl}/reviews/${this.review.id}`, reviewData, {
    headers: this.getAuthHeaders()
  }).subscribe({
    next: (response: any) => {
      const userData = this.review.user;
      this.showEditForm = false;
      this.reviewUpdated.emit({...response, user: userData});
    },
    error: (error) => {
      console.error('Error updating review:', error);
    },
    complete: () => {
      this.isSubmitting = false;
    }
  });
}

  deleteReview() {
    if (confirm('Are you sure you want to delete this review?')) {
      this.http.delete(`${this.authService.apiUrl}/reviews/${this.review.id}`, {
        headers: this.getAuthHeaders()
      }).subscribe({
        next: () => {
          this.reviewDeleted.emit(this.review.id);
        },
        error: (error) => {
          console.error('Error deleting review:', error);
        }
      });
    }
  }
}
