import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './_services/auth-guard.service';
import { AddModelComponent } from './_pages/add-model/add-model.component';
import { HomeComponent } from './_pages/home/home.component';
import { MyDatasetsComponent } from './_pages/my-datasets/my-datasets.component';
import { MyModelsComponent } from './_pages/my-models/my-models.component';
import { MyPredictorsComponent } from './_pages/my-predictors/my-predictors.component';
import { BrowsePredictorsComponent } from './_pages/browse-predictors/browse-predictors.component';
import { BrowseDatasetsComponent } from './_pages/browse-datasets/browse-datasets.component';
import { SettingsComponent } from './_pages/settings/settings.component';
import { ProfileComponent } from './_pages/profile/profile.component';
import { PredictComponent } from './_pages/predict/predict.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'add-model', component: AddModelComponent },
  { path: 'my-datasets', component: MyDatasetsComponent, canActivate: [AuthGuardService] },
  { path: 'my-models', component: MyModelsComponent, canActivate: [AuthGuardService] },
  { path: 'my-predictors', component: MyPredictorsComponent, canActivate: [AuthGuardService] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'browse-datasets', component: BrowseDatasetsComponent },
  { path: 'browse-predictors', component: BrowsePredictorsComponent },
  { path: 'predict', component: PredictComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
