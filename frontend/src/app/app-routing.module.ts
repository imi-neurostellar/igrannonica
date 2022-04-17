import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './_services/auth-guard.service';
import { HomeComponent } from './_pages/home/home.component';
import { MyDatasetsComponent } from './_pages/my-datasets/my-datasets.component';
import { MyModelsComponent } from './_pages/my-models/my-models.component';
import { MyPredictorsComponent } from './_pages/my-predictors/my-predictors.component';
import { BrowsePredictorsComponent } from './_pages/browse-predictors/browse-predictors.component';
import { BrowseDatasetsComponent } from './_pages/browse-datasets/browse-datasets.component';
import { SettingsComponent } from './_pages/settings/settings.component';
import { ProfileComponent } from './_pages/profile/profile.component';
import { PredictComponent } from './_pages/predict/predict.component';
import { FilterDatasetsComponent } from './_pages/filter-datasets/filter-datasets.component';
import { ExperimentComponent } from './experiment/experiment.component';
import { TrainingComponent } from './training/training.component';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { title: 'Početna strana' } },
  /*{ path: 'add-model', component: AddModelComponent, data: { title: 'Dodaj model' } },*/
  { path: 'experiment', component: ExperimentComponent, data: { title: 'Dodaj eksperiment' } },
  { path: 'training', component: TrainingComponent, data: { title: 'Treniraj model' } },
  { path: 'training/:id', component: TrainingComponent, data: { title: 'Treniraj model' } },
  { path: 'my-datasets', component: MyDatasetsComponent, canActivate: [AuthGuardService], data: { title: 'Moji izvori podataka' } },
  { path: 'my-models', component: MyModelsComponent, canActivate: [AuthGuardService], data: { title: 'Moji modeli' } },
  { path: 'my-predictors', component: MyPredictorsComponent, canActivate: [AuthGuardService], data: { title: 'Moji trenirani modeli' } },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService], data: { title: 'Podešavanja' } },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService], data: { title: 'Profil' } },
  { path: 'browse-datasets', component: FilterDatasetsComponent, data: { title: 'Javni izvori podataka' } },
  { path: 'browse-predictors', component: BrowsePredictorsComponent, data: { title: 'Javni trenirani modeli' } },
  { path: 'predict/:id', component: PredictComponent, data: { title: 'Predvidi vrednosti' } },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
