import { Component, OnInit } from '@angular/core';
import { DatasetsService } from 'src/app/_services/datasets.service';
import Dataset from 'src/app/_data/Dataset';
import {Router} from '@angular/router'
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import shared from 'src/app/Shared';

@Component({
  selector: 'app-filter-datasets',
  templateUrl: './filter-datasets.component.html',
  styleUrls: ['./filter-datasets.component.css']
})
export class FilterDatasetsComponent implements OnInit {

  shared = shared;
  publicDatasets?: Dataset[];
  term: string = "";
  constructor(private datasets: DatasetsService,private router:Router, private cookie: CookieService) {
    this.datasets.getPublicDatasets().subscribe((datasets) => {
      this.publicDatasets = datasets;
    });
  }

  ngOnInit(): void {

  }
  addDataset(dataset: Dataset):void{
    //this.router.navigateByUrl('/predict?id='+id);
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.cookie.get("token"));
    const newDataset={...dataset};
    newDataset._id = "";
    newDataset.isPublic = false;
    newDataset.lastUpdated = new Date();
    newDataset.uploaderId = decodedToken.uploaderId;
    let name=prompt("Unesite naziv dataset-a",newDataset.name);
    newDataset.name=name as string;
    if(name!=null && name!="")
    this.datasets.addDataset(newDataset).subscribe((response:string)=>{
      shared.openDialog("Obaveštenje", "Uspešno ste dodali dataset sa nazivom " + newDataset.name);
    },(error)=>{
      shared.openDialog("Obaveštenje", "U svojoj kolekciji već imate dataset sa ovim imenom. Molimo Vas da unesete drugo ime.");
    });
  
  };

}
