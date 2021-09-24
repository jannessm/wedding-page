import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay, map } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { User } from 'src/models/user';
import { ApiError } from 'src/models/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  isAdmin = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string | null = null;

  loggedUser: User | null = null;

  constructor(private api: ApiService) { }

  login(user: string, pwd: string): Observable<User | ApiError> {
    return this.api.authorize(user, pwd).pipe(
      map(resp => {
        let data;
        if (resp.hasOwnProperty('name')) {
          data = <User>resp;
          this.loggedUser = data;
          this.isLoggedIn = true;

          if (data.name === 'jannes' || data.name === 'tina') {
            this.isAdmin = true;
          } else {
            this.isAdmin = false;
          }
        } else if (resp.hasOwnProperty('error')) {
          data = <ApiError>resp;
        } else {
          data = {
            error: 'Don\'t know what happend'
          };
        }
        return data;
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    this.loggedUser = null;
  }
}
