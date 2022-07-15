import { Injectable } from '@angular/core';
import { Observable, of, Subject, Subscriber } from 'rxjs';
import { GuestTable } from 'src/models/guest-table';
import { AGE_CATEGORIES, DIETS, Guest, GuestResponse, UserResponse } from 'src/models/user';

import { v4 as uuid } from 'uuid';
import { API_STATUS } from 'src/models/api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { CacheService } from '../cache/cache.service';
import { AllergiesVector, RegisteredVector } from 'src/models/vector';
import { ALLERGIES } from 'src/models/allergies';
import { UserApiService } from '../api/user-api/user-api.service';
import { GuestApiService } from '../api/guest-api/guest-api.service';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  guests: Subject<GuestTable[]>;
  _lastDataObject: GuestTable[] | undefined;

  adults = new RegisteredVector();
  children = new RegisteredVector();
  infants = new RegisteredVector();

  vegan = 0;
  vegetarian = 0;
  normal = 0;

  allergiesCounter = new AllergiesVector(Object.values(ALLERGIES).length);
  otherAllergies: string[] = [];

  constructor(
    private apiService: GuestApiService,
    private snackBar: MatSnackBar,
  ) {
    this.guests = new Subject<GuestTable[]>();
    
    this.apiService.getGuests().subscribe(data => {
      this.parseData(<GuestResponse>(data.payload));
    })
  }

  parseData(guests: GuestResponse) {
    const guestsData: GuestTable[] = Object.values(guests).map( guest => {
      return <GuestTable>{
        user: guest.user_id,
        uuid: guest.uuid,
        name: guest.name,
        lastname: guest.lastname,
        age: guest.age,
        isComing: guest.isComing,
        diet: guest.diet,
        song: guest.song,
        editMode: false,
        allergies: guest.allergies,
        otherAllergies: guest.otherAllergies
      }
    });

    this.countData(guestsData);
    this._lastDataObject = guestsData;
    this.guests.next(guestsData);
  }

  // addGuest(username: string, newGuest: Guest): Observable<boolean> {
  //   const user = this.cacheService.getUserObject(username);
  //   if (!user) {
  //     this.snackBar.open("Benutzer nicht gefunden.", "Ok");
  //     return of(false);
  //   }

  //   const origGuestIds = user.guests.map(guest => guest.uuid);

  //   const guestExists = user.guests.reduce((exists, guest) => guest.uuid === newGuest.uuid || exists, false);

  //   if (guestExists) {
  //     this.snackBar.open("Gast existiert bereits.", "Ok");
  //     return of(false);
  //   }

    // user.guests.push(newGuest);

    // return this.cacheService.updateUser().pipe(
    //   map(resp => {
    //     if (resp?.status !== API_STATUS.SUCCESS) {
    //       // reset guests
    //       user.guests = user.guests.filter(guest => guest.uuid in origGuestIds);
    //       this.snackBar.open("Etwas ist schief gelaufen.", "Ok");
    //       return false;
    //     } else {
    //       this.cacheService.data.next(this.cacheService._lastDataObject);
    //       return true;
    //     }
    //   }));
  // }

  updateGuest(updatedGuest: Guest): Observable<Guest | boolean> {

    const oldGuest = this._lastDataObject?.find(guest => guest.uuid == updatedGuest.uuid);
    
    if (!!oldGuest) {
      return this.apiService.updateGuests([updatedGuest]).pipe(
        map(resp => {
          if (!!resp && resp.status == API_STATUS.ERROR) {
            this.snackBar.open("Änderungen konnten nicht gespeichert werden.", "OK");

            updatedGuest.name = oldGuest.name;
            updatedGuest.lastname = oldGuest.lastname;
            updatedGuest.age = oldGuest.age;
            updatedGuest.allergies = oldGuest.allergies;
            updatedGuest.otherAllergies = oldGuest.otherAllergies;
            updatedGuest.diet = oldGuest.diet;
            updatedGuest.isComing = oldGuest.isComing;

            return oldGuest;
          }
          return true;
      }));
    }

    this.snackBar.open("Änderungen konnten nicht gespeichert werden.", "OK");
    return of(false);
  }

  deleteGuest(guestId: string): Observable<boolean> {
    return this.apiService.deleteGuest(guestId)
      .pipe(map(resp => {
        if (!!resp && resp.status == API_STATUS.ERROR) {
          this.snackBar.open("Gast konnte nicht gelöscht werden.", "OK");
          return false;
        
        } else {
          this._lastDataObject = this._lastDataObject?.filter(guest => guest.uuid !== guestId);
          this.guests.next(this._lastDataObject);
          return true;
        }
      }));
  }

  countData(guests: GuestTable[]) {
    this.adults.reset();
    this.children.reset();
    this.infants.reset();

    this.vegan = 0;
    this.vegetarian = 0;
    this.normal = 0;

    this.allergiesCounter.reset();

    this.otherAllergies = [];

    guests.forEach((guest: GuestTable) => {

      switch(guest.age) {
        case AGE_CATEGORIES.ADULT:
          this.adults = this.adults.count(guest.isComing);
          break;
        case AGE_CATEGORIES.CHILD:
          this.children.count(guest.isComing);
          break;
        case AGE_CATEGORIES.INFANT:
          this.infants.count(guest.isComing);
          break;
      }

      if (guest.isComing) {
        switch(guest.diet) {
          case DIETS.VEGAN:
            this.vegan++;
            break;
          case DIETS.VEGETARIAN:
            this.vegetarian++;
            break;
          case DIETS.NORMAL:
            this.normal++;
        }
      }

      if (guest.isComing) {
        const allergyVec = Object.values(ALLERGIES).map(allergy => guest.allergies.includes(allergy) ? 1 : 0);
        this.allergiesCounter.add(new AllergiesVector().from(allergyVec));
      }

      if (guest.isComing && guest.otherAllergies.trim() !== '') {
        this.otherAllergies.push(guest.otherAllergies);
      }
    });

    // trigger template reload
    this.adults = this.adults.copy();
    this.children = this.children.copy();
    this.infants = this.infants.copy();
  }

}