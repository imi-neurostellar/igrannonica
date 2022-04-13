import { Component, OnInit } from '@angular/core';
import shared from 'src/app/Shared';
import Model from 'src/app/_data/Model';
import { ModelsService } from 'src/app/_services/models.service';

@Component({
  selector: 'app-my-models',
  templateUrl: './my-models.component.html',
  styleUrls: ['./my-models.component.css']
})
export class MyModelsComponent implements OnInit {
  myModels: Model[] = [];
  //myModel: Model;

  constructor(private modelsS : ModelsService) {

    

     }

  ngOnInit(): void {
    this.getAllMyModels();

  }
/*
  editModel(): void{
    this.modelsS.editModel().subscribe(m => {
      this.myModel = m;

    })
  }
*/

deleteThisModel(model: Model): void{
  shared.openYesNoDialog('Brisanje seta podataka','Da li ste sigurni da želite da obrišete model?',() => {
  this.modelsS.deleteModel(model).subscribe((response) => {
    this.getAllMyModels();
  }, (error) =>{
      if (error.error == "Model with name = {name} deleted") {
        shared.openDialog("Obaveštenje", "Greška prilikom brisanja modela.");
      }
    });
  });
}


  getAllMyModels(): void{
    this.modelsS.getMyModels().subscribe(m => {
      this.myModels = m;
    });
  }

}
