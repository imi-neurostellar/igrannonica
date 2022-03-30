import { Component, OnInit } from '@angular/core';
import { DatasetsService } from 'src/app/_services/datasets.service';
import Dataset from 'src/app/_data/Dataset';
import {Router} from '@angular/router'
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-filter-datasets',
  templateUrl: './filter-datasets.component.html',
  styleUrls: ['./filter-datasets.component.css']
})
export class FilterDatasetsComponent implements OnInit {

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
    newDataset.username = decodedToken.name;
    let name=prompt("Unesite naziv dataset-a",newDataset.name);
    newDataset.name=name as string;
    if(name!=null && name!="")
    this.datasets.addDataset(newDataset).subscribe((response:string)=>{
      console.log(response);
      alert("Uspenso ste dodali dataset sa imenom "+newDataset.name);
    },(error)=>{
      alert("Vec imate dataset sa istim imenom molim vas unesite drugo ime");
      

    });
  
  };

}
