import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'Tina und Jannes';
  
  constructor(public authService: AuthService, private router: Router, private ccService: NgcCookieConsentService) {
    this.authService = authService;
    this.router = router;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/', 'login'])
  }
}
