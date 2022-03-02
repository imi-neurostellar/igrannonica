import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LaptopComponent } from '../laptop/laptop.component';
import { Laptop } from '../models/laptop';
import { LibraryServiceService } from '../services/library.service';

@Component({
  selector: 'app-new-laptop',
  templateUrl: './new-laptop.component.html',
  styleUrls: ['./new-laptop.component.css']
})
export class NewLaptopComponent implements OnInit {

  laptop:Laptop= {} as Laptop
  constructor(private router:Router, private library: LibraryServiceService) { }

  ngOnInit(): void {
    
  }


  back()
  {
    this.router.navigate(["/homepage"])
  }

  dodaj(laptop:Laptop)
  {
    this.library.unesiLaptop(laptop).subscribe(laptop=>{
      this.router.navigate(["/laptop/"+laptop.id])
    })
  }


}
