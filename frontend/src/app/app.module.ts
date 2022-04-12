import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgChartsModule } from 'ng2-charts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatasetLoadComponent } from './_elements/dataset-load/dataset-load.component';
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
import { SettingsComponent } from './_pages/settings/settings.component';
import { ProfileComponent } from './_pages/profile/profile.component';
import { MyPredictorsComponent } from './_pages/my-predictors/my-predictors.component';
import { MyDatasetsComponent } from './_pages/my-datasets/my-datasets.component';
import { MyModelsComponent } from './_pages/my-models/my-models.component';
import { BrowseDatasetsComponent } from './_pages/browse-datasets/browse-datasets.component';
import { BrowsePredictorsComponent } from './_pages/browse-predictors/browse-predictors.component';
import { PredictComponent } from './_pages/predict/predict.component';
import { ScatterchartComponent } from './scatterchart/scatterchart.component';
import { BarchartComponent } from './barchart/barchart.component';
import { NotificationsComponent } from './_elements/notifications/notifications.component';
import { DatatableComponent } from './_elements/datatable/datatable.component';
import { FilterDatasetsComponent } from './_pages/filter-datasets/filter-datasets.component';
import { ReactiveBackgroundComponent } from './_elements/reactive-background/reactive-background.component';
import { ItemModelComponent } from './_elements/item-model/item-model.component';
import { AnnvisualComponent } from './_elements/annvisual/annvisual.component';
import { ExperimentComponent } from './experiment/experiment.component';
import { LoadingComponent } from './_elements/loading/loading.component';
import { ModelLoadComponent } from './_elements/model-load/model-load.component';
import { AlertDialogComponent } from './_modals/alert-dialog/alert-dialog.component';
import { AddNewDatasetComponent } from './_elements/add-new-dataset/add-new-dataset.component';
import { GraphComponent } from './_elements/graph/graph.component';
import { TrainingComponent } from './training/training.component';
import { ItemExperimentComponent } from './_elements/item-experiment/item-experiment.component';
import { YesNoDialogComponent } from './_modals/yes-no-dialog/yes-no-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DatasetLoadComponent,
    LoginModalComponent,
    RegisterModalComponent,
    HomeComponent,
    NavbarComponent,
    ItemPredictorComponent,
    ItemDatasetComponent,
    CarouselComponent,
    SettingsComponent,
    ProfileComponent,
    MyPredictorsComponent,
    MyDatasetsComponent,
    MyModelsComponent,
    BrowseDatasetsComponent,
    BrowsePredictorsComponent,
    PredictComponent,
    ScatterchartComponent,
    BarchartComponent,
    NotificationsComponent,
    DatatableComponent,
    FilterDatasetsComponent,
    ReactiveBackgroundComponent,
    ItemModelComponent,
    AnnvisualComponent,
    ExperimentComponent,
    LoadingComponent,
    ModelLoadComponent,
    AlertDialogComponent,
    AddNewDatasetComponent,
    GraphComponent,
    TrainingComponent,
    ItemExperimentComponent,
    YesNoDialogComponent
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
    MatIconModule,
    NgChartsModule,
    Ng2SearchPipeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [AlertDialogComponent]
})
export class AppModule { }
