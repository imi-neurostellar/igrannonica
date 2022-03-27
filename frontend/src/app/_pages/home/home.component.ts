import { Component, OnInit } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';
import Predictor from 'src/app/_data/Predictor';
import { ItemDatasetComponent } from 'src/app/_elements/item-dataset/item-dataset.component';
import shared from 'src/app/Shared';
import { DatasetsService } from 'src/app/_services/datasets.service';
import { PredictorsService } from 'src/app/_services/predictors.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  publicDatasets: Dataset[];
  publicPredictors: Predictor[];

  shared = shared;

  constructor() {
    this.publicDatasets = [
      new Dataset('Titanik', 'Titanik', ['Kolona1', 'Kolona2', 'Ime', 'OsobaJePreživela']),
      new Dataset('Drugi Dataset', 'Lorem ipsum dolor sir amet', ['jabuka', 'kruska', 'jagoda']),
      new Dataset('Dataset III', 'Kratak opis izvora podataka', ['c1', 'c2', 'c3', 'c4', 'c5']),
      new Dataset('Drugi Dataset', 'Lorem ipsum dolor sir amet', ['jabuka', 'kruska', 'jagoda']),
      new Dataset('Dataset III', 'Kratak opis izvora podataka', ['c1', 'c2', 'c3', 'c4', 'c5']),
      new Dataset('Drugi Dataset', 'Lorem ipsum dolor sir amet', ['jabuka', 'kruska', 'jagoda']),
      new Dataset('Dataset III', 'Kratak opis izvora podataka', ['c1', 'c2', 'c3', 'c4', 'c5']),
      new Dataset('Dataset III', 'Kratak opis izvora podataka', ['c1', 'c2', 'c3', 'c4', 'c5'])
    ]
    this.publicPredictors = [
      new Predictor('Preživeli', 'Za uneto ime osobe, predvidja da li je ta osoba preživela ili ne.', ['Ime'], 'OsobaJePreživela'),
      new Predictor('Drugi model', 'Lorem ipsum dolor sir amet', ['kruska'], 'jagoda'),
      new Predictor('Treći model', 'Kratak opis modela', ['c1', 'c2', 'c3'], 'c5'),
      new Predictor('Drugi model', 'Lorem ipsum dolor sir amet', ['kruska'], 'jagoda'),
      new Predictor('Treći model', 'Kratak opis modela', ['c1', 'c2', 'c3'], 'c5'),
      new Predictor('Drugi model', 'Lorem ipsum dolor sir amet', ['kruska'], 'jagoda'),
      new Predictor('Treći model', 'Kratak opis modela', ['c1', 'c2', 'c3'], 'c5'),
      new Predictor('Treći model', 'Kratak opis modela', ['c1', 'c2', 'c3'], 'c5')
    ]
  }

  ngOnInit(): void {
  }

}
