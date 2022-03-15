import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { RegisterPageComponent } from './_pages/register-page/register-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OnlyAuthorizedComponent } from './_pages/only-authorized/only-authorized.component';
import { DatasetLoadComponent } from './_elements/dataset-load/dataset-load.component';
import { AddModelComponent } from './_pages/add-model/add-model.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModalComponent } from './_modals/login-modal/login-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterModalComponent } from './_modals/register-modal/register-modal.component';

import { MaterialModule } from './material.module';
import { HomeComponent } from './_pages/home/home.component';
import { NavbarComponent } from './_elements/navbar/navbar.component';
import { ItemPredictorComponent } from './_elements/item-predictor/item-predictor.component';
import { ItemDatasetComponent } from './_elements/item-dataset/item-dataset.component';
import { CarouselComponent } from './_elements/carousel/carousel.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterPageComponent,
    OnlyAuthorizedComponent,
    DatasetLoadComponent,
    AddModelComponent,
    LoginModalComponent,
    RegisterModalComponent,
    HomeComponent,
    NavbarComponent,
    ItemPredictorComponent,
    ItemDatasetComponent,
    CarouselComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
