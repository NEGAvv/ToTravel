import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  serverErrors: any = {};
  generalError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', Validators.required],
      },
      { validators: [this.passwordMatchValidator] }
    );
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('password_confirmation')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.serverErrors = {};
    this.generalError = '';


    const { name, email, password, password_confirmation } = this.registerForm.value;

    this.authService.register(name, email, password, password_confirmation).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        if (err.error && err.error.errors) {
          this.serverErrors = err.error.errors;
          
          const errorCount = Object.values(err.error.errors).reduce((count: number, errors: any) => count + errors.length, 0);
          if (errorCount > 1) {
            this.generalError = `${err.error.message}`;
          }
        } else {
          this.generalError = err.error.message || 'An error occurred during registration';
        }
      }
    });

  }
}
