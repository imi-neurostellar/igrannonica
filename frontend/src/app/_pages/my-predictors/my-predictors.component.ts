import { Component, OnInit } from '@angular/core';
import Predictor from 'src/app/_data/Predictor';
import { PredictorsService } from 'src/app/_services/predictors.service';

@Component({
  selector: 'app-my-predictors',
  templateUrl: './my-predictors.component.html',
  styleUrls: ['./my-predictors.component.css']
})
export class MyPredictorsComponent implements OnInit {
  predictors: Predictor[] = [];
  constructor(private predictorsS : PredictorsService) {
  }
  ngOnInit(): void {
    this.getAllMyPredictors();

  }

  delete(predictor: Predictor){
    if(window.confirm("IZABRANI MODEL ĆE BITI IZBRISAN"))
      {
      this.predictorsS.deletePredictor(predictor).subscribe((response) => {
        console.log("OBRISANOOO JEE", response);
        //na kraju uspesnog
        this.getAllMyPredictors();
      }, (error) =>{
          if (error.error == "Predictor with name = {name} deleted") {
            alert("Greška pri brisanju modela!");
          }
        });
    }
    
    
  }

  getAllMyPredictors(): void{
    this.predictorsS.getMyPredictors().subscribe(m => {
      
      this.predictors = m;
      console.log(this.predictors);
    });
  }


}
