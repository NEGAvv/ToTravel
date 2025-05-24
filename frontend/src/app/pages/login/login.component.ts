import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  loginForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  serverErrors: any = {};
  generalError: string = '';


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        //password_confirmation: ['', Validators.required],
      },
     // { validators: [this.passwordMatchValidator] }
    );
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  // toggleConfirmPasswordVisibility() {
  //   this.hideConfirmPassword = !this.hideConfirmPassword;
  // }

  // passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  //   const password = group.get('password')?.value;
  //   const confirm = group.get('password_confirmation')?.value;
  //   return password === confirm ? null : { passwordMismatch: true };
  // }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.serverErrors = {};
    this.generalError = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/']); 
      },
      error: (err) => {
        if (err.error) {
          if (err.error.errors) {
            this.serverErrors = err.error.errors;
          }
          this.generalError = err.error.message || 'Login failed';
        } else {
          this.generalError = 'An unknown error occurred';
        }
      }
    });
  }

}
