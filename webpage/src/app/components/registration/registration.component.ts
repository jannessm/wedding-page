import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DIETS, DIET_LABELS, User } from 'src/models/user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  form: FormArray;
  user: User | null;

  diets = Object.values(DIETS)
  dietLabels = DIET_LABELS;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.user = this.authService.loggedUser;

    if (!!this.user) {
      this.form = fb.array(this.user.guests.map(guest => 
        fb.group({
          'isComming': [guest.isRegistered],
          'diet': [guest.diet, Validators.required],
          'allergies': [guest.allergies],
          'song': [guest.song]
        })
      ));
    } else {
      this.form = fb.array([]);
    }
    this.form.setErrors({})
  }

  saveChanges() {}

  resetForm() {
    if (!!this.user) {
      this.form = this.fb.array(this.user.guests.map(guest => 
        this.fb.group({
          'isComming': [guest.isRegistered],
          'diet': [guest.diet, Validators.required],
          'allergies': [guest.allergies],
          'song': [guest.song]
        })
      ));
    } else {
      this.form = this.fb.array([]);
    }
  }

}
