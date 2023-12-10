import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError, tap, catchError } from 'rxjs'; // Il BehaviourSubject è un tipo particolare di Observable che richiede un valore iniziale, emette in tempo reale il cambiamento di valore e si desottoscrive DA SOLO immediatamente dopo - L'operatore tap è utilizzato per manipolare il PRIMO valore emesso da una chiamata HTTP
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtHelper = new JwtHelperService();
  apiURL = environment.apiURL;
  private authSubj = new BehaviorSubject<null | Auth>(null);
  user$ = this.authSubj.asObservable();
  user!: Auth;

  constructor(private http: HttpClient, private router: Router) {}

  login(data: { email: string; password: string }) {
    return this.http.post<Auth>(`${this.apiURL}login`, data).pipe(
      tap((dataLogin) => {
        this.authSubj.next(dataLogin);
        this.user = dataLogin;
        localStorage.setItem('user', JSON.stringify(dataLogin));
        alert('Login effettuato');
        this.router.navigate(['/']);
      }),
      catchError(this.errors)
    );
  }
  restore() {
    // Utilizzato nel caso in cui l'utente abbandoni l'applicazione senza fare logout; se rientra e il token è ancora valido, non dovrà rifare login
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    const userData: Auth = JSON.parse(user);
    if (this.jwtHelper.isTokenExpired(userData.accessToken)) {
      this.router.navigate(['/login']);
      return;
    }
    this.authSubj.next(userData); // Rientrando nell'applicazione dopo essere usciti, il BehaviourSubject è di nuovo null: in questo modo riceve i valori presenti nel localStorage e comunica di nuovo a user$ la presenza dell'utente
  }
  register(data: { name: string; email: string; password: string }) {
    return this.http.post(`${this.apiURL}register`, data).pipe(
      tap(() => {
        this.router.navigate(['/login']), catchError(this.errors);
      })
    );
  }
  logout() {
    this.authSubj.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
  private errors(err: any) {
    console.log(err);
    switch (err.error) {
      case 'Email already exists':
        return throwError('Email già registrata');
        break;

      case 'Email format is invalid':
        return throwError('Formato mail non valido');
        break;

      case 'Cannot find user':
        return throwError('Utente inesistente');
        break;

      default:
        return throwError('Errore nella chiamata');
        break;
    }
  }
}
