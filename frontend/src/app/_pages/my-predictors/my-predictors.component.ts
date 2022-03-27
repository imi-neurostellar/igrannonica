import { Component, OnInit } from '@angular/core';
import Predictor from 'src/app/_data/Predictor';

@Component({
  selector: 'app-my-predictors',
  templateUrl: './my-predictors.component.html',
  styleUrls: ['./my-predictors.component.css']
})
export class MyPredictorsComponent implements OnInit {
  predictors: Predictor[];
  constructor() { 
  this.predictors = [
    new Predictor('Titanik', 'Opis titanik', ['K1', 'K2', 'K3', 'Ime', 'Preziveli'],'Preziveli'),
    new Predictor('Neki drugi set', 'opis', ['a', 'b', 'c'],'c'),
    new Predictor('Preživeli', 'Za uneto ime osobe, predvidja da li je ta osoba preživela ili ne.', ['Ime'], 'OsobaJePreživela'),
    new Predictor('Drugi model', 'Lorem ipsum dolor sir amet', ['kruska'], 'jagoda')];
  }
  ngOnInit(): void {
  }

  delete(){
    confirm("IZABRANI MODEL ĆE BITI IZBRISAN")
    
  }
  


}
