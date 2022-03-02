import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Laptop } from '../models/laptop';
import { LibraryServiceService } from '../services/library.service';

@Component({
  selector: 'app-laptop',
  templateUrl: './laptop.component.html',
  styleUrls: ['./laptop.component.css']
})
export class LaptopComponent implements OnInit {
  laptop?:Laptop
  laptopoviM?:Laptop[]
  constructor(private library: LibraryServiceService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {

    this.route.params.subscribe(url =>{
      this.library.dajLaptop(url["id"]).subscribe(laptop=>{
        this.laptop = laptop;
      })
    })
  }


  pogledaj(id:String)
  {
    this.router.navigate(["/laptop/"+id])
  }
}
