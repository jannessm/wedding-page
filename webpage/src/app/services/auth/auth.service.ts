import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { User } from 'src/models/user';
import { API_STATUS, DataResponse } from 'src/models/api';
import { LocalStorageService } from '../local-storage/local-storage.service';

import jwt_decode from 'jwt-decode';
import { JWT } from 'src/models/jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  _loginStatusChanged: Subscriber<boolean> | undefined;
  loginStatusChanged: Observable<boolean>;
  isLoggedIn = false;
  isAdmin = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string | null = null;

  // loggedUser: User | null = {
  //   name: "jannes",
  //   isAdmin: true,
  //   firstLogin: false,
  //   firstPassword: "test",
  //   guests: []
  // };
  loggedUser: User | null = null;

  constructor(private api: ApiService, private lsService: LocalStorageService) {
    this.loginStatusChanged = new Observable<boolean>(subscriber => this._loginStatusChanged = subscriber);

    this.loginStatusChanged.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
    
    if (!!this.lsService.jwt) {
      const jwt = this.lsService.jwt;
      this.api.validateJWT(jwt).subscribe(resp => {
        if (resp.status === API_STATUS.SUCCESS && !!jwt) {
          this.setJWT((<DataResponse>resp).payload);
        }
      });
    }
  }

  login(user: string, pwd: string): Observable<User | undefined> {
    return this.api.authorize(user, pwd).pipe(
      map(resp => {
        let data;
        
        if (resp.status === API_STATUS.SUCCESS) {
          let r = <DataResponse>resp;
                
          this.lsService.jwt = r.payload;
          return this.setJWT(r.payload);
        
        } else {
          console.log('wrong credentials.');
        }
        
        return data;
      })
    );
  }

  logout(): void {
    this._loginStatusChanged?.next(false);
    this.loggedUser = null;
    this.lsService.jwt = undefined;
  }

  setJWT(jwt: string): User {
    const jwt_decoded: JWT = jwt_decode(jwt);
    
    this.loggedUser = <User>jwt_decoded.user;
    this._loginStatusChanged?.next(true);

    return jwt_decoded.user;
  }
}
