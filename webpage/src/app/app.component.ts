import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
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
  
  constructor(
    public authService: AuthService,
    private router: Router,
    private ccService: NgcCookieConsentService,
    iconRegistry: MatIconRegistry,
    domSaniziter: DomSanitizer
  ) {
    this.authService = authService;
    this.router = router;

    iconRegistry.addSvgIcon('vegan', domSaniziter.bypassSecurityTrustResourceUrl('/assets/vegan.svg'));
    iconRegistry.addSvgIcon('vegetarian', domSaniziter.bypassSecurityTrustResourceUrl('/assets/milk-bottle.svg'));
    iconRegistry.addSvgIcon('gluten-free', domSaniziter.bypassSecurityTrustResourceUrl('/assets/gluten-free.svg'));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/', 'login'])
  }
}
