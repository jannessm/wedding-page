import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { AuthGuard } from './auth.guard';
import { AccomondationsComponent } from './components/accomondations/accomondations.component';
import { AdminComponent } from './components/admin/admin.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { CookieComponent } from './components/cookie/cookie.component';
import { DressCodeComponent } from './components/dress-code/dress-code.component';
import { GiftsComponent } from './components/gifts/gifts.component';
import { LoginComponent } from './components/login/login.component';
import { ProgrammComponent } from './components/programm/programm.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { IsLoggedInGuard } from './is-logged-in.guard';

const routes: Routes = [
  {path: 'user', canActivate: [AuthGuard], children: [
    {path: 'registration', component: RegistrationComponent},
    {path: 'accomondations', component: AccomondationsComponent},
    {path: 'gifts', component: GiftsComponent},
    {path: 'program', component: ProgrammComponent},
    {path: 'dress-code', component: DressCodeComponent},
    {path: 'admin', component: AdminComponent},
    {path: 'change-password', component: ChangePasswordComponent},
  ]},
  {path: 'login', component: LoginComponent, canActivate: [IsLoggedInGuard]},
  {path: 'cookies', component: CookieComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
