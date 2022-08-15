import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import md5 from 'md5-ts';
import { ConfirmValidator } from 'src/app/confirm-validator';
import { UserApiService } from 'src/app/services/api/user-api/user-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { API_STATUS } from 'src/models/api';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: UntypedFormGroup;
  wrongCredentials = false;

  constructor(
    fb: UntypedFormBuilder,
    private apiService: UserApiService,
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
        this.authService.loggedUser.name,
        md5(this.form.controls.old_pw.value),
        md5(this.form.controls.pw1.value)
      ).subscribe(resp => {

        if (resp.status === API_STATUS.SUCCESS && !!this.authService.loggedUser) {
          const redirectUrl = !!this.authService.redirectUrl ? this.authService.redirectUrl : '/program';

          this.authService.loggedUser.firstLogin = false;
  
          this.router.navigate([redirectUrl]);
        } else {
          this.wrongCredentials = true;
  
          this.f.old_pw.setErrors({});
        }
      });
    }
  }

}
