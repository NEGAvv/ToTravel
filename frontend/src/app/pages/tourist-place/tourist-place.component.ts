import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LikeService } from '../../core/services/like.service';
import { AuthService } from '../../core/auth/auth.service';
import { TouristPlaceDetailsComponent } from '../../components/tourist-place-details/tourist-place-details.component';
import { ReviewListComponent } from '../../components/review-list/review-list.component';
import { ReviewComponent } from '../../components/review/review.component';
import { CommentComponent } from '../../components/comment/comment.component';

@Component({
  selector: 'app-tourist-place',
  standalone: true,
  imports: [CommonModule,
    TouristPlaceDetailsComponent,
    ReviewListComponent,
    RouterModule,
  ],
  templateUrl: './tourist-place.component.html',
  styleUrl: './tourist-place.component.scss'
})
export class TouristPlaceComponent implements OnInit {
  placeId!: string;
   place: any = { reviews: [] };
  isLoading = true;
  activeImage: string | null = null;
  activeIndex = 0;
  isLiked = false;
  currentUserId: number | null = null;  

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private likeService: LikeService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.placeId = this.route.snapshot.paramMap.get('id')!;
   this.authService.getUser().subscribe({
      next: (res) => {
        this.currentUserId = res.data.id;
        this.loadPlaceData(); 
        this.checkPlaceLikeStatus();
      },
      error: () => {
        this.loadPlaceData(); 
        this.checkPlaceLikeStatus();
      }
    });
  }
handleReviewLike(review: any) {
  this.toggleReviewLike(review);
}

  loadPlaceData(): void {
    this.http.get(`http://127.0.0.1:8000/api/places/${this.placeId}`).subscribe({
      next: (data: any) => {
        this.place = data;
        console.log('place', this.place);
        this.isLoading = false;
        this.initReviewLikes();
      },
      error: (err) => {
        console.error('Error loading place:', err);
        this.isLoading = false;
      }
    });
  }

  checkPlaceLikeStatus(): void {
    this.likeService.getSavedPlaces().subscribe({
      next: (places: any[]) => {
        this.isLiked = places.some(p => p.id == this.placeId);
      },
      error: (err) => console.error('Error checking place like:', err)
    });
  }

   initReviewLikes(): void {
    if (!this.place.reviews) return;
    this.place.reviews.forEach((review: any) => {
      review.liked = review.likes?.some((like: any) => like.user_id === this.currentUserId) ?? false;
      review.likes = review.likes?.length ?? 0;
    });
  }

  togglePlaceLike(): void {
    const data = { place_id: Number(this.placeId) };

    if (this.isLiked) {
      this.likeService.unlikeItem(data).subscribe({
        next: () => this.isLiked = false,
        error: (err) => {
          if (err.status === 409) this.isLiked = true;
          console.error('Error unliking place:', err);
        }
      });
    } else {
      this.likeService.likeItem(data).subscribe({
        next: () => this.isLiked = true,
        error: (err) => {
          if (err.status === 409) this.isLiked = true;
          console.error('Error liking place:', err);
        }
      });
    }
  }

  toggleReviewLike(review: any): void {
    const data = { review_id: review.id };

    if (review.liked) {
      this.likeService.unlikeItem(data).subscribe({
        next: () => {
          review.liked = false;
          review.likes--;
        },
        error: (err) => {
          if (err.status === 409) review.liked = true;
          console.error('Error unliking review:', err);
        }
      });
    } else {
      this.likeService.likeItem(data).subscribe({
        next: () => {
          review.liked = true;
          review.likes++;
        },
        error: (err) => {
          if (err.status === 409) review.liked = true;
          console.error('Error liking review:', err);
        }
      });
    }
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