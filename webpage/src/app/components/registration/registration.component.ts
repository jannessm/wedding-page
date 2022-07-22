import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GuestApiService } from 'src/app/services/api/guest-api/guest-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ALLERGIES, ALLERGIES_LABELS } from 'src/models/allergies';
import { API_STATUS, DataResponse } from 'src/models/api';
import { DIETS, DIET_LABELS, Guest, User } from 'src/models/user';
import { getYoutubeID, isYoutubeLink } from 'src/models/youtube';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  form: FormArray;
  user: User | null;
  guests: Observable<Guest[]> | null;
  guests_arr: Guest[] = [];

  diets = Object.values(DIETS);
  dietLabels = DIET_LABELS;

  allergies = Object.values(ALLERGIES);
  allergiesLabels = ALLERGIES_LABELS;

  youtubeURLs: SafeResourceUrl[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private guestApi: GuestApiService,
    private sanitizer: DomSanitizer,
    private snackbar: MatSnackBar
  ) {
    this.user = this.authService.loggedUser;
    this.guests = null;

    this.form = fb.array([]);
    
    if (!!this.user) {
      this.guests = this.guestApi.getGuestsForUser(this.user.name).pipe(map(resp => {
        if (resp && resp.status == API_STATUS.SUCCESS) {
          return <Guest[]> (<DataResponse>resp).payload;
        }
        return [];
      }));

      this.guests.subscribe(guests => {
        this.youtubeURLs = [];

        this.form = fb.array(guests.map(guest => 
          fb.group({
            'isComing': [guest.isComing, Validators.required],
            'diet': [guest.diet, Validators.required],
            'allergies': [guest.allergies],
            'otherAllergies': [guest.otherAllergies],
            'song': [guest.song],
          })
        ));

        guests.forEach(guest => this.youtubeURLs.push(this.getSaveYoutubeURL(guest.song)));

        this.guests_arr = guests;
        console.log(guests);
      });
    }
  }

  saveChanges() {
    this.form.controls.forEach((guest, id) => {
      if (!!this.guests_arr) {
        this.guests_arr[id].isComing = (<FormGroup>guest).controls.isComing.value;
        this.guests_arr[id].diet = (<FormGroup>guest).controls.diet.value;
        this.guests_arr[id].allergies = (<FormGroup>guest).controls.allergies.value;
        this.guests_arr[id].otherAllergies = (<FormGroup>guest).controls.otherAllergies.value;
        this.guests_arr[id].song = (<FormGroup>guest).controls.song.value;
      }
    });

    if (!!this.user) {
      this.guestApi.updateGuests(this.guests_arr).subscribe( resp => {
        if (resp && resp.status === API_STATUS.SUCCESS) {
          this.snackbar.open('Erfolgreich gespeichert!', 'Ok');
        } else {
          this.snackbar.open('Speichern Fehlgeschlagen!', 'Ok');
        }
      });
    }
  }

  updateSaveYoutubeURL(event: Event) {
    return this.getSaveYoutubeURL((<HTMLInputElement>event.target).value);
  }

  getSaveYoutubeURL(link: string) {
    if (!isYoutubeLink(link)) {
      return '';
    }
    const youtubeId = getYoutubeID(link);
    return this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + 
    youtubeId);
  }
}
