import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CacheService } from 'src/app/services/cache/cache.service';
import { ALLERGIES, ALLERGIES_LABELS } from 'src/models/allergies';
import { DIETS, DIET_LABELS, User } from 'src/models/user';
import { getYoutubeID, isYoutubeLink } from 'src/models/youtube';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  form: FormArray;
  user: User | null;

  diets = Object.values(DIETS);
  dietLabels = DIET_LABELS;

  allergies = Object.values(ALLERGIES);
  allergiesLabels = ALLERGIES_LABELS;

  youtubeURLs: SafeResourceUrl[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService, private sanitizer: DomSanitizer, private cacheService: CacheService) {
    this.user = this.authService.loggedUser;

    if (!!this.user) {
      this.form = fb.array(this.user.guests.map(guest => 
        fb.group({
          'isComing': [guest.isComing, Validators.required],
          'diet': [guest.diet, Validators.required],
          'allergies': [guest.allergies],
          'otherAllergies': [guest.otherAllergies],
          'song': [guest.song],
        })
      ));
    } else {
      this.form = fb.array([]);
    }

    this.user?.guests.forEach(guest => this.youtubeURLs.push(this.getSaveYoutubeURL(guest.song)));
  }

  saveChanges() {
    this.form.controls.forEach((guest, id) => {
      if (!!this.user) {
        this.user.guests[id].isComing = (<FormGroup>guest).controls.isComing.value;
        this.user.guests[id].diet = (<FormGroup>guest).controls.diet.value;
        this.user.guests[id].allergies = (<FormGroup>guest).controls.allergies.value;
        this.user.guests[id].otherAllergies = (<FormGroup>guest).controls.otherAllergies.value;
        this.user.guests[id].otherAllergies = (<FormGroup>guest).controls.otherAllergies.value;
        this.user.guests[id].song = (<FormGroup>guest).controls.song.value;
      }
    });

    if (!!this.user) {
      this.cacheService.updateUserNonAdmin(this.user).subscribe();
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
