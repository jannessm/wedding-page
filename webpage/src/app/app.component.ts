import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { registerLocaleData } from '@angular/common';
import localDe from '@angular/common/locales/de';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Tina und Jannes';

  navItems = [
    {text: 'Programm', link:'/program'},
    {text: 'Dress Code', link:'/dress-code'},
    {text: 'Fotos', link:'/photos'},
    {text: 'Geschenketipps', link:'/gifts'},
    {text: 'Unterkünfte', link:'/accomondations'},
  ];

  menuExpanded = false;
  
  constructor(
    public authService: AuthService,
    public router: Router,
    iconRegistry: MatIconRegistry,
    domSaniziter: DomSanitizer,
  ) {
    registerLocaleData(localDe, 'de');
    iconRegistry.addSvgIcon('vegan', domSaniziter.bypassSecurityTrustResourceUrl('/assets/vegan.svg'));
    iconRegistry.addSvgIcon('vegetarian', domSaniziter.bypassSecurityTrustResourceUrl('/assets/milk-bottle.svg'));
    iconRegistry.addSvgIcon('gluten-free', domSaniziter.bypassSecurityTrustResourceUrl('/assets/gluten-free.svg'));
    iconRegistry.addSvgIcon('person', domSaniziter.bypassSecurityTrustResourceUrl('/assets/non-binary.svg'));
    iconRegistry.addSvgIcon('meat', domSaniziter.bypassSecurityTrustResourceUrl('/assets/meat.svg'));
    iconRegistry.addSvgIcon('nut', domSaniziter.bypassSecurityTrustResourceUrl('/assets/nut.svg'));
    iconRegistry.addSvgIcon('apple', domSaniziter.bypassSecurityTrustResourceUrl('/assets/apple.svg'));
    iconRegistry.addSvgIcon('dress', domSaniziter.bypassSecurityTrustResourceUrl('/assets/dress.svg'));
    iconRegistry.addSvgIcon('suite', domSaniziter.bypassSecurityTrustResourceUrl('/assets/suite.svg'));
    iconRegistry.addSvgIcon('wedding', domSaniziter.bypassSecurityTrustResourceUrl('/assets/wedding.svg'));
    iconRegistry.addSvgIcon('excel', domSaniziter.bypassSecurityTrustResourceUrl('/assets/excel.svg'));
  }

  nav(link: string) {
    this.menuExpanded = false;
    this.router.navigate([link]);
  }

  logout() {
    this.authService.logout();
    this.menuExpanded = false;
    this.router.navigate(['/program']);
  }
}
