import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Shared from 'src/app/Shared';
import Experiment from 'src/app/_data/Experiment';
import Model from 'src/app/_data/Model';
import { FormModelComponent } from 'src/app/_elements/form-model/form-model.component';
import { ModelsService } from 'src/app/_services/models.service';

@Component({
  selector: 'app-page-model',
  templateUrl: './page-model.component.html',
  styleUrls: ['./page-model.component.css']
})
export class PageModelComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private modelsService: ModelsService) { }
  model!:Model;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = this.route.snapshot.paramMap.get("id");
      if (id) {
        this.modelsService.getModelById(id).subscribe((model) => {
          this.model = model;
        });
      } else {
        this.router.navigate(['']);
      }
    });
  }

  import() {
    this.model._id = "";
    this.model.isPublic = false;
    this.modelsService.stealModel(this.model).subscribe((response) => {
      Shared.openDialog("Obaveštenje", "Uspešno ste dodali javnu konfiguraciju neuronske mreže u vašu kolekciju.");
    }, (error: any) => {
      Shared.openDialog("Obaveštenje", "Konfiguracija neuronske mreže sa ovim imenom postoji u vašoj kolekciji.");
    });
  }
  JSON=JSON;
}
