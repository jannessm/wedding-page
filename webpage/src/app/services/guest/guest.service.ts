import { Injectable } from '@angular/core';
import { Observable, of, Subscriber } from 'rxjs';
import { GuestTable, UserTable } from 'src/models/guest-table';
import { Guest, User, UserResponse } from 'src/models/user';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

import { v4 as uuid } from 'uuid';
import { ApiResponse, API_STATUS, DataResponse } from 'src/models/api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { DialogService } from '../dialog/dialog.service';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  _guests: Subscriber<GuestTable[]> | undefined;
  guests: Observable<GuestTable[]>;

  constructor(
    private cacheService: CacheService,
    private snackBar: MatSnackBar,
  ) {
    this.guests = new Observable<GuestTable[]>(subscriber => this._guests = subscriber);
    
    this.cacheService.data.subscribe(data => {
      console.log('g');
      this.parseData(data);
    })
  }

  parseData(users: UserResponse) {
    const guestsData: GuestTable[] = [];

    Object.keys(users).forEach(username => {

      const origUser = users[username];
      origUser.guests.map( guest => {
        if (!guest.uuid) {
          guest.uuid = uuid()
        }

        return <GuestTable>{
          user: username,
          uuid: guest.uuid,
          name: guest.name,
          lastname: guest.lastname,
          age: guest.age,
          isRegistered: guest.isRegistered,
          diet: guest.diet,
          song: guest.song,
          editMode: false,
          allergies: ""
        }
      }).forEach(val => guestsData.push(val));
    });

    this._guests?.next(guestsData);
  }

  addGuest(username: string, newGuest: Guest): Observable<boolean> {
    const user = this.cacheService.getUserObject(username);
    if (!user) {
      this.snackBar.open("Benutzer nicht gefunden.", "Ok");
      return of(false);
    }

    const origGuestIds = user.guests.map(guest => guest.uuid);

    const guestExists = user.guests.reduce((exists, guest) => guest.uuid === newGuest.uuid || exists, false);

    if (guestExists) {
      this.snackBar.open("Gast existiert bereits.", "Ok");
      return of(false);
    }

    user.guests.push(newGuest);

    return this.cacheService.updateUser().pipe(
      map(resp => {
        if (resp?.status !== API_STATUS.SUCCESS) {
          // reset guests
          user.guests = user.guests.filter(guest => guest.uuid in origGuestIds);
          this.snackBar.open("Etwas ist schief gelaufen.", "Ok");
          return false;
        } else {
          this.cacheService.data.next(this.cacheService._lastDataObject);
          return true;
        }
      }));
  }

  updateGuest(username: string, updatedGuest: Guest): Observable<Guest | boolean> {
    let oldGuest: Guest;
    const user = this.cacheService.getUserObject(username);
    
    if (!!user) {
      user.guests.forEach(guest => {
        if (guest.uuid === updatedGuest.uuid) {
          // copy old data for restoring if needed
          oldGuest = {
            name: guest.name,
            lastname: guest.lastname,
            age: guest.age,
            allergies: guest.allergies,
            diet: guest.diet,
            isRegistered: guest.isRegistered,
            uuid: guest.uuid,
            song: guest.song
          };


          guest.name = updatedGuest.name;
          guest.lastname = updatedGuest.lastname;
          guest.age = updatedGuest.age;
          guest.allergies = updatedGuest.allergies;
          guest.diet = updatedGuest.diet;
          guest.isRegistered = updatedGuest.isRegistered;
        }
      });

      return this.cacheService.updateUser().pipe(
        map(resp => {
          if (!!resp && resp.status == API_STATUS.ERROR) {
            this.snackBar.open("Änderungen konnten nicht gespeichert werden.", "OK");

            updatedGuest.name = oldGuest.name;
            updatedGuest.lastname = oldGuest.lastname;
            updatedGuest.age = oldGuest.age;
            updatedGuest.allergies = oldGuest.allergies;
            updatedGuest.diet = oldGuest.diet;
            updatedGuest.isRegistered = oldGuest.isRegistered;

            return oldGuest;
          }
          return true;
      }));
    }

    this.snackBar.open("Änderungen konnten nicht gespeichert werden.", "OK");
    return of(false);
  }

  deleteGuest(username: string, guestId: string): Observable<boolean> {
    const user = this.cacheService.getUserObject(username);
    
    if (!!user) {
      const oldGuests = user.guests;

      user.guests = user.guests.filter(guest => guest.uuid !== guestId);

      return this.cacheService.updateUser()
        .pipe(map(resp => {
          if (!!resp && resp.status == API_STATUS.ERROR) {
            this.snackBar.open("Gast konnte nicht gelöscht werden.", "OK");

            user.guests = oldGuests;
            return false;
          
          } else {
            this.cacheService.getData();
            return true;
          }
        }));
    }

    return of(false);
  }

}