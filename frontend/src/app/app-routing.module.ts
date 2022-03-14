import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './_services/auth-guard.service';
import { LoginPageComponent } from './_pages/login-page/login-page.component';
import { OnlyAuthorizedComponent } from './_pages/only-authorized/only-authorized.component';
import { RegisterPageComponent } from './_pages/register-page/register-page.component';
import { AddModelComponent } from './_pages/add-model/add-model.component';
import { LoginModalComponent } from './_modals/login-modal/login-modal.component';
import { HomeComponent } from './_pages/home/home.component';
import { RegisterModalComponent } from './_modals/register-modal/register-modal.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'only-authorized', component: OnlyAuthorizedComponent, canActivate: [AuthGuardService] },
  { path: 'add-model', component: AddModelComponent },
  { path: 'login-modal-test', component: LoginModalComponent },
  { path: 'register-modal-test', component: RegisterModalComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
