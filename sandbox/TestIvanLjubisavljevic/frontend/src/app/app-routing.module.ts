import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { IzmeniLaptopComponent } from './izmeni-laptop/izmeni-laptop.component';
import { LaptopComponent } from './laptop/laptop.component';
import { NewLaptopComponent } from './new-laptop/new-laptop.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {path:"", component:HomepageComponent},
  {path:"homepage", component:HomepageComponent},
  {path:"newLaptop", component:NewLaptopComponent},
  {path:"izmeniLaptop/:id", component:IzmeniLaptopComponent},
  {path:"laptop/:id", component:LaptopComponent},
  {path:"**", component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
