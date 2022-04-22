import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './_services/auth-guard.service';
import { HomeComponent } from './_pages/home/home.component';
import { ProfileComponent } from './_pages/profile/profile.component';
import { PlaygroundComponent } from './_pages/playground/playground.component';
import { ExperimentComponent } from './_pages/experiment/experiment.component';
import { ArchiveComponent } from './_pages/archive/archive.component';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { title: 'Početna strana' } },
  { path: 'experiment', component: ExperimentComponent, data: { title: 'Eksperiment' } },
  { path: 'archive', component: ArchiveComponent, data: { title: 'Arhiva' } },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService], data: { title: 'Profil' } },
  { path: 'playground', component: PlaygroundComponent, data: { title: 'Zabava' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
