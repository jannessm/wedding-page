import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import md5 from 'md5-ts';
import { ConfirmValidator } from 'src/app/confirm-validator';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  wrongCredentials = false;

  constructor(
    fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    public authService: AuthService
  ) {
    this.form = fb.group({
      'old_pw': ['', Validators.required],
      'pw1': ['', Validators.required],
      'pw2': ['', Validators.required, ConfirmValidator('pw1')],
    });
  }

  ngOnInit(): void {
  }

  get f(){
    return this.form.controls;
  }

  changePassword() {
    if (this.authService.loggedUser) {
      this.apiService.changePassword(
        this.authService.loggedUser?.name,
        md5(this.form.controls.old_pw.value),
        md5(this.form.controls.pw1.value)
      ).subscribe(data => {
        if (data.hasOwnProperty('name')) {
          this.authService.loggedUser = <User>data;
  
          this.router.navigate(['/', 'user', 'program']);
        } else {
          this.wrongCredentials = true;
  
          this.f.old_pw.setErrors({});
        }
      });
    }
  }

}
