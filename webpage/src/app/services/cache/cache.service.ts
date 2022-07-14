import { Injectable } from '@angular/core';
import { merge, Observable, of, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ApiResponse, API_STATUS, DataResponse } from 'src/models/api';
import { User, UserResponse } from 'src/models/user';
import { UserApiService } from '../api/user-api/user-api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  _initialized = false;
  _lastDataObject: UserResponse | undefined;
  data: Subject<UserResponse>;

  constructor(
    private apiService: UserApiService,
    private authService: AuthService,
  ) {
    this.data = new Subject<UserResponse>();

    this.authService.loggedStateChanges.subscribe(() => {
      this._lastDataObject = undefined;
      this._initialized = false;
      this.data.next({});
    });

    this.getData().subscribe();
  }

  handleData(resp: ApiResponse) {
    let users = (<DataResponse>resp).payload;
    this._lastDataObject = users;
    this.data.next(users);
  }

  getData(): Observable<undefined> {
    if (this.authService.loggedUser?.isAdmin && !this._initialized) {
      return this.apiService.getUsers().pipe(tap(resp => {
        if (resp.status === API_STATUS.SUCCESS) {
          this.handleData(resp);
          this._initialized = true;
        }
      }), map(() => undefined));
    
    } else if (this.authService.loggedUser?.isAdmin) {
      this.data.next(this._lastDataObject);
    
    } else if (this.authService.loggedUser) {
      const user = this.authService.loggedUser;
      const data: UserResponse = {};
      // data[user.name] = user;
      this._lastDataObject = data;
      this.data.next(data);
    }
    
    return of(undefined);
  }

  getUserObject(username: string): User | undefined {
    if (this._lastDataObject) {
      // return this._lastDataObject[username];
      return {
        "name": "hi",
        "firstLogin": false,
        "firstPassword": "xxx",
        "isAdmin": true,
        "guests": "test, test"
      };
    } else {
      this.getData().subscribe();
    }
    return;
  }

  deleteUser(username: string): Observable<boolean> {
    return this.apiService.deleteUser(username).pipe(
      map(resp => {
        if (resp.status == API_STATUS.ERROR) {
          return false;
        
        } else {
          this.handleData(resp);
          return true;
        }
      }
    ));
  }

  resetUserPwd(username: string): Observable<boolean> {
    return this.apiService.resetPwd(username).pipe(
      map(
        reps => reps.status === API_STATUS.SUCCESS
      ));
  }
}
