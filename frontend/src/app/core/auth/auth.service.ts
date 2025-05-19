import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  data: {
    id: number;
    name: string;
    email: string;
    role: string;
    bio: string | null;
    location: string | null;
    interests: string | null;
    avatar_url: string | null;
    created_at: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  public apiUrl  = 'http://127.0.0.1:8000/api'; 

   private _isLoggedIn$!: BehaviorSubject<boolean>;
  isLoggedIn$!: Observable<boolean>;

  constructor(private http: HttpClient, public token: TokenService) {
    this._isLoggedIn$ = new BehaviorSubject<boolean>(this.token.hasToken());
    this.isLoggedIn$ = this._isLoggedIn$.asObservable();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        this.token.setToken(res.token);
        this._isLoggedIn$.next(true);
      })
    );
  }

  register(name: string, email: string, password: string, password_confirmation: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      name,
      email,
      password,
      password_confirmation
    }).pipe(
      tap((res) => {
        this.token.setToken(res.token);
        this._isLoggedIn$.next(true);
      })
    );
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token.getToken()}`,
    });
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        this.token.clearToken();
        this._isLoggedIn$.next(false);
      })
    );
  }

  isLoggedIn(): boolean {
    return this.token.hasToken();
  }

  getUser(): Observable<User> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token.getToken()}`,
  });
  return this.http.get<User>(`${this.apiUrl}/user`, { headers });
}

}
