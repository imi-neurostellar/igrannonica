import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from './configuration.service';
import Experiment from '../_data/Experiment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExperimentsService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  addExperiment(experiment: Experiment): Observable<any> {
    return this.http.post(`${Configuration.settings.apiURL}/experiment/add`, experiment, { headers: this.authService.authHeader() });
  }

  getMyExperiments(): Observable<Experiment[]> {
    return this.http.get<Experiment[]>(`${Configuration.settings.apiURL}/experiment/getmyexperiments`, { headers: this.authService.authHeader() });
  }

  /*updateExperiment(){

  }*/
}
