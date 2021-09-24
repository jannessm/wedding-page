import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { GiftsComponent } from './components/gifts/gifts.component';
import { AccomondationsComponent } from './components/accomondations/accomondations.component';
import { ProgrammComponent } from './components/programm/programm.component';
import { DressCodeComponent } from './components/dress-code/dress-code.component';
import { AdminComponent } from './components/admin/admin.component';

import {NgcCookieConsentModule, NgcCookieConsentConfig} from 'ngx-cookieconsent';
import { CookieComponent } from './components/cookie/cookie.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
 
const cookieConfig:NgcCookieConsentConfig = {
  "cookie": {
    "domain": "tinesoft.github.io"
  },
  "position": "top-right",
  "theme": "block",
  "palette": {
    "popup": {
      "background": "#85abe0",
      "text": "#000000",
      "link": "#ffffff"
    },
    "button": {
      "background": "#f1d600",
      "text": "#000000",
      "border": "transparent"
    }
  },
  "type": "info",
  "content": {
    "message": "Diese Webseite nutzt ausschließlich funktionale Cookies, um Sessions zu ermöglichen.",
    "dismiss": "Verstanden",
    "deny": "",
    "link": "Weitere Infos",
    "href": "/cookies",
    "policy": "Cookie Policy"
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    GiftsComponent,
    AccomondationsComponent,
    ProgrammComponent,
    DressCodeComponent,
    AdminComponent,
    CookieComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
    
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
