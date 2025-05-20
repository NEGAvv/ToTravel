import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-survey',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.scss'
})
export class SurveyComponent {
  form: FormGroup;
  categories = [
    'hotel', 'attraction', 'geographic', 'restaurant',
  ];

  submitted = false;
  responseMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient,public authService: AuthService) {
    this.form = this.fb.group({
      about: [''],
      country: ['', Validators.required],
      rating: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      selectedCategories: this.fb.group(
        Object.fromEntries(this.categories.map(c => [c, false])),
        { validators: this.requireAtLeastOneCategory }
      )
    });
  }

  requireAtLeastOneCategory(group: FormGroup) {
    const hasAtLeastOne = Object.values(group.value).some(val => val);
    return hasAtLeastOne ? null : { requireOne: true };
  }

  onSubmit() {
  this.submitted = true;
  if (this.form.invalid) return;

  const selected = Object.entries(this.form.value.selectedCategories)
    .filter(([_, checked]) => checked)
    .map(([category]) => category)
    .join(',');

  const payload = {
    country: this.form.value.country,
    rating: this.form.value.rating,
    category: selected,
  };

  const token = this.authService.token.getToken();

  if (!token) {
    this.responseMessage = 'You must be logged in to submit preferences.';
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`
  };

  this.http.post('http://127.0.0.1:8000/api/preferences', payload, { headers }).subscribe({
    next: res => this.responseMessage = 'Preferences saved successfully!',
    error: err => {
      this.responseMessage = 'Something went wrong!';
      console.error(err);
    }
  });
}

}
