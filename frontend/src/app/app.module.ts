import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './_pages/login-page/login-page.component';
import { RegisterPageComponent } from './_pages/register-page/register-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OnlyAuthorizedComponent } from './_pages/only-authorized/only-authorized.component';
import { DatasetLoadComponent } from './_elements/dataset-load/dataset-load.component';
import { AddModelComponent } from './_pages/add-model/add-model.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModalComponent } from './_modals/login-modal/login-modal.component';
import { RegisterModalComponent } from './_modals/register-modal/register-modal.component';

import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegisterPageComponent,
    OnlyAuthorizedComponent,
    DatasetLoadComponent,
    AddModelComponent,
    LoginModalComponent,
    RegisterModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
