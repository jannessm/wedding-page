import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserApiService } from '../api/user-api/user-api.service';
import { User } from 'src/models/user';
import { API_STATUS, DataResponse } from 'src/models/api';
import { LocalStorageService } from '../local-storage/local-storage.service';

import jwt_decode from 'jwt-decode';
import { JWT } from 'src/models/jwt';
import { ReplaySubject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  _jwtValidation: Observable<boolean>;
  _isLoggedIn: boolean | undefined;
  isAdmin = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string | null = null;

  loggedUser = new BehaviorSubject<User | null>(null);

  loggedStateChanges = new EventEmitter<undefined>();

  constructor(
    private api: UserApiService,
    private lsService: LocalStorageService,
  ) {

    
    if (!!this.lsService.jwt) {
      const jwt = this.lsService.jwt;
      this._jwtValidation = this.api.validateJWT(jwt).pipe(
        map(resp => {
          if (resp.status === API_STATUS.SUCCESS && !!jwt) {
            this.setJWT((<DataResponse>resp).payload);
            return true;
          } else {
            return false;
          }
        }));
    } else {
      this._jwtValidation = of(false);
    }
    this._jwtValidation.subscribe();
  }

  isLoggedIn(): Observable<boolean> {
    // no JWT set
    if (!this.lsService.jwt) {
      return of(false);
    }

    // logged in is set
    if (this._isLoggedIn != undefined) {
      return of(this._isLoggedIn);
    }

    // get result from jwt validation
    return this._jwtValidation;
  }

  login(user: string, pwd: string): Observable<User | undefined> {
    return this.api.authorize(user, pwd).pipe(
      map(resp => {
        let data;
        
        if (resp.status === API_STATUS.SUCCESS) {
          let r = <DataResponse>resp;
                
          this.lsService.jwt = r.payload;
          this.loggedStateChanges.next();
          return this.setJWT(r.payload);
        
        }
        
        return data;
      })
    );
  }

  logout(): void {
    this.loggedUser.next(null);
    this._isLoggedIn = false;
    this.lsService.jwt = undefined;
    this.loggedStateChanges.next();
  }

  setJWT(jwt: string): User {
    const jwt_decoded: JWT = jwt_decode(jwt);
    
    this.loggedUser.next(<User>jwt_decoded.user);
    this._isLoggedIn = true;
    this.isAdmin = (<User>jwt_decoded.user).isAdmin;

    return jwt_decoded.user;
  }
}
