import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})

export class EditComponent implements OnInit{

user: any = {
    name: '',
    bio: '',
    location: '',
    interests: [],
    avatar_url: '',
    created_at: ''
  };
  
  originalUser: any = {};
  interestsInput = '';
  editInterests = false;
  formattedDate = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.http.get('http://localhost:8000/api/profile').subscribe({
      next: (res: any) => {
        this.user = {...res.data};
        this.originalUser = {...res.data};
        this.interestsInput = this.user.interests?.join(', ') || '';
        this.formatDate();
      },
      error: (err) => {
        console.error('Помилка завантаження профілю', err);
      }
    });
  }

  formatDate() {
    if (this.user.created_at) {
      const date = new Date(this.user.created_at);
      this.formattedDate = date.toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
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


onInterestsChange(value: string) {
  this.user.interests = value
    .split(',')
    .map(item => item.trim())
    .filter(item => item);
}


  saveInterests() {
    if (this.interestsInput) {
      this.user.interests = this.interestsInput.split(',')
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 0);
    } else {
      this.user.interests = [];
    }
    this.editInterests = false;
  }

  cancelEditInterests() {
    this.interestsInput = this.user.interests?.join(', ') || '';
    this.editInterests = false;
  }

  updateProfile() {
    const payload = {
      name: this.user.name,
      bio: this.user.bio,
      location: this.user.location,
      interests: this.interestsInput
    };

    this.http.put('http://localhost:8000/api/profile', payload).subscribe({
      next: (res: any) => {
        this.user = res.data;
        this.originalUser = {...res.data};
        this.interestsInput = this.user.interests?.join(', ') || '';
         this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Помилка оновлення профілю', err);
        alert('Сталася помилка при оновленні профілю');
      }
    });
  }

  cancelEdit() {
    this.user = {...this.originalUser};
    this.interestsInput = this.user.interests?.join(', ') || '';
    this.editInterests = false;
     this.router.navigate(['/profile']);
  }

onBioKeyDown(event: KeyboardEvent) {
    const textarea = event.target as HTMLTextAreaElement;
    const currentLines = textarea.value.split('\n').length;
    
    if (event.key === 'Enter' && currentLines >= 4) {
      event.preventDefault(); 
    }
  }


  limitBioChars() {
    if (this.user.bio && this.user.bio.length > 170) {
      this.user.bio = this.user.bio.slice(0, 170);
    }
  }

  
  }




