import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading = true;
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:8000/api/profile').subscribe({
      next: (res) => {
        this.user = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Unable to load profile.';
        this.loading = false;
      },
    });
  }

  get formattedDate(): string {
    return this.user?.created_at
      ? new Date(this.user.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '-';
  }

  get avatarUrl(): string {
    // Додайте перевірку на повний URL
    if (this.user?.avatar_url) {
        return this.user.avatar_url;
    }
    return 'assets/images/default_avatar.png'; // Використовуйте шлях до дефолтного аватара у вашому проекті
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

goToEditProfile() {
    this.router.navigate(['/profile/edit']);
}
goToSurvey() {
  this.router.navigate(['/survey']);
}
}
