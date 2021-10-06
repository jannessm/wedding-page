import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Tina und Jannes';

  navItems = [
    {text: 'Programm', link:'/user/program'},
    {text: 'Rückmeldung', link:'/user/registration'},
    {text: 'Dress Code', link:'/user/dress-code'},
    {text: 'Geschenketipps', link:'/user/gifts'},
    {text: 'Unterkünfte', link:'/user/accomondations'},
  ];
  
  constructor(
    public authService: AuthService,
    public router: Router,
    iconRegistry: MatIconRegistry,
    domSaniziter: DomSanitizer,
    private activeRoute: ActivatedRoute
  ) {
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

  ngOnInit() {
    this.activeRoute.url.subscribe(console.log);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/', 'login']);
  }
}
