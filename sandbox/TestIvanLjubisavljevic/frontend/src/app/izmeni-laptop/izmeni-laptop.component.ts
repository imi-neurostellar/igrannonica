import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Laptop } from '../models/laptop';
import { LibraryServiceService } from '../services/library.service';

@Component({
  selector: 'app-izmeni-laptop',
  templateUrl: './izmeni-laptop.component.html',
  styleUrls: ['./izmeni-laptop.component.css']
})
export class IzmeniLaptopComponent implements OnInit {
  laptop?:Laptop
  izmenio?:boolean
  constructor(private router:Router,private library:LibraryServiceService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(url=>{
      this.library.dajLaptop(url["id"]).subscribe(laptop =>{
        this.laptop = laptop
      })
    })
  }

  izmeni(laptop?:Laptop)
  {
    this.library.izmeniLaptop(laptop).subscribe(laptop=>{
      this.route.params.subscribe(url=>{
        this.library.dajLaptop(url["id"]).subscribe(laptop =>{
          this.laptop = laptop
          this.izmenio = true;
        })
      })
    })
  }

  back()
  {
    this.router.navigate(["/homepage"])
  }



}
