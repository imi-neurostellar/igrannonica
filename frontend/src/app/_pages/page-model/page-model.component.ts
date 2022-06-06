import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Shared from 'src/app/Shared';
import Model from 'src/app/_data/Model';
import { FormModelComponent } from 'src/app/_elements/form-model/form-model.component';
import { ModelsService } from 'src/app/_services/models.service';

@Component({
  selector: 'app-page-model',
  templateUrl: './page-model.component.html',
  styleUrls: ['./page-model.component.css']
})
export class PageModelComponent implements OnInit {

  @ViewChild(FormModelComponent) formModel!: FormModelComponent;

  constructor(private route: ActivatedRoute, private router: Router, private modelsService: ModelsService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = this.route.snapshot.paramMap.get("id");
      if (id) {
        this.modelsService.getModelById(id).subscribe((model) => {
          this.formModel.newModel = model;
        });
      } else {
        this.router.navigate(['']);
      }
    });
  }

  import() {
    this.formModel.newModel._id = "";
    this.formModel.newModel.isPublic = false;
    this.modelsService.stealModel(this.formModel.newModel).subscribe((response) => {
      Shared.openDialog("Obaveštenje", "Uspešno ste dodali javnu konfiguraciju neuronske mreže u vašu kolekciju.");
    }, (error: any) => {
      Shared.openDialog("Obaveštenje", "Konfiguracija neuronske mreže sa ovim imenom postoji u vašoj kolekciji.");
    });
  }
}
