import { Injectable } from '@angular/core';
import { merge, Observable, of, Subject } from 'rxjs';
import { filter, flatMap, map, tap } from 'rxjs/operators';
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
    const users = (<DataResponse>resp).payload;
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
      data[user.name] = user;
      this._lastDataObject = data;
      this.data.next(data);
    }
    
    return of(undefined);
  }

  getUserObject(username: string): User | undefined {
    if (this._lastDataObject) {
      return this._lastDataObject[username];
    } else {
      this.getData().subscribe();
    }
    return;
  }

  addUser(user: User): Observable<ApiResponse> {
    return this.apiService.addUser(user).pipe(tap(resp => {
      if (resp.status === API_STATUS.SUCCESS) {
        this.handleData(resp);
      }
    }));
  }

  updateUser(): Observable<undefined | ApiResponse> {
    if (this._lastDataObject) {
      if (this.authService.loggedUser) {
        this.authService.loggedUser = this._lastDataObject[this.authService.loggedUser.name];
      }
      return this.apiService.updateUsers(this._lastDataObject);
    } else {
      return merge(this.getData(), this.updateUser()).pipe(filter(x => !!x));
    }
  }

  updateUserNonAdmin(updatedUser: User): Observable<undefined | ApiResponse> {
    console.log(this._lastDataObject);
    if (this._lastDataObject) {
      return this.apiService.updateUser(updatedUser).pipe(
        tap(resp => {
          if (resp.status === API_STATUS.SUCCESS && this._lastDataObject) {
            const user = this._lastDataObject[updatedUser.name];

            // make sure firstLogin is done
            user.firstLogin = false;

            user.guests.forEach((guest, id) => {
              guest.isComing = updatedUser.guests[id].isComing;
              guest.diet = updatedUser.guests[id].diet;
              guest.allergies = updatedUser.guests[id].allergies;
              guest.otherAllergies = updatedUser.guests[id].otherAllergies;
              guest.song = updatedUser.guests[id].song;
            });

            this.authService.loggedUser = user;
          }
        })
      );
    } else {
      return merge(this.getData(), this.updateUserNonAdmin(updatedUser)).pipe(filter(x => !!x));
    }
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
