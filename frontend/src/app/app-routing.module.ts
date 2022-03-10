import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './_services/auth-guard.service';
import { LoginPageComponent } from './_pages/login-page/login-page.component';
import { OnlyAuthorizedComponent } from './_pages/only-authorized/only-authorized.component';
import { RegisterPageComponent } from './_pages/register-page/register-page.component';
import { AddModelComponent } from './_pages/add-model/add-model.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'only-authorized', component: OnlyAuthorizedComponent, canActivate: [AuthGuardService] },
  { path: 'add-model', component: AddModelComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
