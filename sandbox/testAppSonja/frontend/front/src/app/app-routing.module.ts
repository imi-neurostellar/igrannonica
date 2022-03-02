import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditPageComponent } from './edit-page/edit-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { Router } from '@angular/router';
import { AddPageComponent } from './add-page/add-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'edit/:id', component: EditPageComponent },
  { path: 'add', component: AddPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
    constructor(private router: Router){}
 }
