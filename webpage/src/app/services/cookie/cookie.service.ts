import { Injectable, OnDestroy } from '@angular/core';


import { NgcCookieConsentService, NgcInitializeEvent, NgcNoCookieLawEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent';

import * as Cookies from 'es-cookie';
import { COOKIE } from 'src/models/cookies';
import { Subscription } from 'rxjs';
import { COOKIE_CONFIG } from 'src/models/cookie-consent-config';

@Injectable({
  providedIn: 'root'
})
export class CookieService implements OnDestroy {

  private statusChangeSubscription: Subscription;
  private config = COOKIE_CONFIG;


  constructor(private ccService: NgcCookieConsentService) {
 
    this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        console.log("cookie accepted");
        Cookies.set(COOKIE.CONSENT_POPUP, COOKIE.ACCEPTED);
      });

    this.config.enabled = Cookies.get(COOKIE.CONSENT_POPUP) !== COOKIE.ACCEPTED;

    console.log(Cookies.get(COOKIE.CONSENT_POPUP) !== COOKIE.ACCEPTED, Cookies.get(COOKIE.CONSENT_POPUP), COOKIE.ACCEPTED)

    this.ccService.init(this.config);
  }

  ngOnDestroy() {
    this.statusChangeSubscription.unsubscribe();
  }
}
