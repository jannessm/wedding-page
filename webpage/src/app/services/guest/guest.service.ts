import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { GuestTable } from 'src/models/guest-table';
import { UserResponse } from 'src/models/user';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

import { v4 as uuid } from 'uuid';
import { API_STATUS, DataResponse } from 'src/models/api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  _guests: Subscriber<GuestTable[]> | undefined;
  guests: Observable<GuestTable[]>;

  _lastDataObject: UserResponse | undefined;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.guests = new Observable<GuestTable[]>(subscriber => this._guests = subscriber);

    this.getData();
  }

  getData() {
    if (this.authService.loggedUser?.isAdmin) {
      this.apiService.getUsers().subscribe(resp => {
        if (resp.status === API_STATUS.SUCCESS) {
          const users = (<DataResponse>resp).payload;
          this.parseUsers(users);
          this._lastDataObject = users;
        }
      })
    }
  }

  parseUsers(users: UserResponse) {
    const guests: GuestTable[] = [];

    Object.keys(users).forEach(user => {

      const u = users[user];
      u.guests.map( guest => {
        if (!guest.uuid) {
          guest.uuid = uuid()
        }

        return <GuestTable>{
          uuid: guest.uuid,
          name: guest.name,
          lastname: guest.lastname,
          age: guest.age,
          isRegistered: guest.isRegistered,
          diet: guest.diet,
          song: guest.song,
          user: user,
          editMode: false
        }
      }).forEach(val => guests.push(val));
      
      this._guests?.next(guests);
    });
  }

  updateData(updatedGuest: GuestTable) {
    let update = false;
    
    if (this._lastDataObject) {
      const row = this._lastDataObject[updatedGuest.user];
      
      if (!!row) {
        row.guests.forEach(guest => {
          if (guest.uuid === updatedGuest.uuid) {
            update = true;
            guest.name = updatedGuest.name;
            guest.lastname = updatedGuest.lastname;
            guest.age = updatedGuest.age;
            guest.allergies = updatedGuest.allergies;
            guest.diet = updatedGuest.diet;
            guest.isRegistered = updatedGuest.isRegistered;
          }
        });
      }
    }

    if (update && this._lastDataObject) {
      this.apiService.updateUsers(this._lastDataObject).subscribe(resp => {
        if (resp.status == API_STATUS.ERROR) {
          this.snackBar.open("Änderungen konnten nicht gespeichert werden.", "OK");
        }
      });
    }
  }

  deleteData(row: GuestTable) {
    if (this._lastDataObject) {
      const user = this._lastDataObject[row.user];
      
      if (!!user) {
        this.apiService.deleteUser(row.user).subscribe(resp => {
          if (resp.status == API_STATUS.ERROR) {
            this.snackBar.open("Benutzer konnte nicht gelöscht werden.", "OK");
          } else {
            const users = (<DataResponse>resp).payload;
            this.parseUsers(users);
            this._lastDataObject = users;
          }
        });
      }
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, 'OK');
  }
}