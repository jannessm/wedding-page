import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { IsLoggedInGuard } from './is-logged-in.guard';

const routes: Routes = [
  {path: 'registration', component: RegistrationComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent, canActivate: [IsLoggedInGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
