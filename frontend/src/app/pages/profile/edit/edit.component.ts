import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');

  if (id) {
    this.loadUserById(id);
  } else {
    this.loadProfile(); 
  }
  
}

loadUserById(id: string) {
  this.http.get(`http://localhost:8000/api/admin/users/${id}`).subscribe({
    next: (res: any) => {
      this.user = {...res.data};
      if (typeof this.user.interests === 'string') {
        this.user.interests = this.user.interests
          .split(',')
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0);
      }
      this.originalUser = {...res.data};
      this.interestsInput = this.user.interests?.join(', ') || '';
      this.formatDate();
    },
    error: (err) => {
      console.error('Помилка завантаження користувача', err);
    }
  });
}

  loadProfile() {
  this.http.get('http://localhost:8000/api/profile').subscribe({
    next: (res: any) => {
      this.user = { ...res.data };

      if (typeof this.user.interests === 'string') {
        this.user.interests = this.user.interests
          .split(',')
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0);
      }

      this.originalUser = { ...this.user };
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

  const id = this.route.snapshot.paramMap.get('id');
  const url = id 
    ? `http://localhost:8000/api/admin/users/${id}` 
    : `http://localhost:8000/api/profile`;         

  this.http.put(url, payload).subscribe({
    next: (res: any) => {
      this.user = res.data;
      this.originalUser = {...res.data};
      this.interestsInput = this.user.interests?.join(', ') || '';
      const redirect = id ? '/admin' : '/profile';
      this.router.navigate([redirect]);
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

  onAvatarSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  const formData = new FormData();
  formData.append('avatar', file);

  this.http.post('http://localhost:8000/api/profile/avatar', formData).subscribe({
    next: (res: any) => {
      this.user.avatar_url = res.data.avatar_url;
    },
    error: (err) => {
      console.error('Помилка завантаження аватара', err);
      alert('Не вдалося оновити аватар.');
    }
  });
}

  
  }




