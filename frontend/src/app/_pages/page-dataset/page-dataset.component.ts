import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Shared from 'src/app/Shared';
import Dataset from 'src/app/_data/Dataset';
import { FormDatasetComponent } from 'src/app/_elements/form-dataset/form-dataset.component';
import { DatasetsService } from 'src/app/_services/datasets.service';

@Component({
  selector: 'app-page-dataset',
  templateUrl: './page-dataset.component.html',
  styleUrls: ['./page-dataset.component.css']
})
export class PageDatasetComponent implements OnInit {

  @ViewChild(FormDatasetComponent) formDataset!: FormDatasetComponent;

  constructor(private route: ActivatedRoute, private router: Router, private datasetsService: DatasetsService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = this.route.snapshot.paramMap.get("id");
      if (id) {
        this.datasetsService.getDatasetById(id).subscribe((dataset) => {
          this.formDataset.dataset = dataset;
          this.formDataset.loadExisting();
        });
      } else {
        this.router.navigate(['']);
      }
    });
  }

  import() {
    this.formDataset.dataset._id = "";
    this.formDataset.dataset.isPreProcess = true;
    this.formDataset.dataset.isPublic = false;
    this.datasetsService.stealDataset(this.formDataset.dataset).subscribe((response) => {
      Shared.openDialog("Obaveštenje", "Uspešno ste dodali javni izvor podataka u vašu kolekciju.");
    }, (error: any) => {
      if (error.error == "Dataset with this name already exists") {
        Shared.openDialog("Obaveštenje", "Izvor podataka sa ovim imenom postoji u vašoj kolekciji.");
      }
    });
  }
}
