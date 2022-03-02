import { Component,OnInit } from '@angular/core';
import { UcitajService } from './ucitaj.service';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  poruka:string='';
  title:string='Ski';
  constructor(private servis: UcitajService) { }


   
  
  ngOnInit() :void {
    this.servis 
      .dajPoruku()
      .subscribe((poruka2 : string) => {this.poruka = poruka2;
      });
  }
}
