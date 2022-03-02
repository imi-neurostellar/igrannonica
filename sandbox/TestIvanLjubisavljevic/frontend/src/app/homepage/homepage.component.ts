import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Laptop } from '../models/laptop';
import { LibraryServiceService } from '../services/library.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  laptops?:Laptop[]
  constructor(private library : LibraryServiceService, private router:Router) { }

  ngOnInit(): void {
    
    this.library.dajLaptopove().subscribe(laptopovi =>{
      this.laptops = laptopovi
    })
  }

  pogledaj(id:String)
  {
    this.router.navigate(["/laptop/"+id])
  }

  izmeni(laptop:Laptop)
  {
    this.router.navigate(['/izmeniLaptop/'+laptop.id])
  }

  obrisi(laptop:Laptop)
  {
    this.library.obrisiLaptop(laptop.id).subscribe(req=>{
      
        this.library.dajLaptopove().subscribe(laptopovi =>{
          this.laptops = laptopovi
        })
    })
  }

}
