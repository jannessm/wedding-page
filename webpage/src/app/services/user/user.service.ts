import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, Subject, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, API_STATUS } from 'src/models/api';
import { UserTable } from 'src/models/guest-table';
import { User, UserResponse } from 'src/models/user';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { CacheService } from '../cache/cache.service';
import { DialogService } from '../dialog/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: Subject<UserTable[]>;

  constructor(
    private cacheService: CacheService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
  ) {
    this.users = new Subject<UserTable[]>();
    
    this.cacheService.data.subscribe(data => {
      this.parseData(data);
    });
  }

  parseData(users: UserResponse) {

    const usersData: UserTable[] = [];

    Object.keys(users).forEach(username => {

      const origUser = users[username];

      const user: UserTable = {
        name: username,
        isAdmin: origUser.isAdmin,
        guests: origUser.guests
          .map( guest => !!guest.lastname ? `${guest.name} ${guest.lastname}` : guest.name)
      };

      usersData.push(user);
    });

    this.users.next(usersData);
  }

  addUser(user: User): Observable<ApiResponse> {
    return this.cacheService.addUser(user);
  }

  updateUser(updatedUser: UserTable): Observable<boolean> {
    let update = false;

    if (updatedUser.name === this.authService.loggedUser?.name && updatedUser.isAdmin !== this.authService.loggedUser?.isAdmin) {
      this.snackBar.open("Rechte des aktuellen Admins können nicht übernommen werden.", "OK");
      updatedUser.isAdmin = !updatedUser.isAdmin;
      return of(false);
    }
    
    const user = this.cacheService.getUserObject(updatedUser.name);
    if (!!user && user.isAdmin !== updatedUser.isAdmin) {
      user.isAdmin = updatedUser.isAdmin;
      update = true;
    }

    if (update && !!user) {
      return this.cacheService.updateUser().pipe(
        map(resp => {
          if (!resp || resp.status == API_STATUS.ERROR) {
            this.snackBar.open("Änderungen konnten nicht gespeichert werden.", "OK");
            user.isAdmin = !updatedUser.isAdmin;
            return false;
          } else {
            return true;
          }
        }));
    }

    return of(false);
  }

  deleteUser(row: UserTable): Observable<boolean> {
    if (row.name === this.authService.loggedUser?.name) {
      this.snackBar.open("Der aktuelle Benutzer kann nicht gelöscht werden.", "OK");
      return of(false);
    }

    const user = this.cacheService.getUserObject(row.name);
    if (!!user) {
      return this.cacheService.deleteUser(row.name)
        .pipe(map(resp => {
          if (!resp) {
            this.snackBar.open("Benutzer konnte nicht gelöscht werden.", "OK");
            return false;
          
          } else {
            return true;
          }
        }));
    }

    return of(false);
  }

  resetPwd(username: string) {
    this.cacheService.resetUserPwd(username).subscribe(success => {
      if (success) {
        let password = "";

        const user = this.cacheService.getUserObject(username);
        if (!!user) {
          password = user.firstPassword;
        }

        this.dialogService.openInfoDialog(`Passwort wurde auf "${password}" zurückgesetzt.`);
      }
    });
  }
}
