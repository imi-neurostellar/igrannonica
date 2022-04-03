import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_SETTINGS } from 'src/config';
import Predictor from '../_data/Predictor';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PredictorsService {



  constructor(private http: HttpClient, private authService: AuthService) { }

  getPublicPredictors(): Observable<Predictor[]> {
    return this.http.get<Predictor[]>(`${API_SETTINGS.apiURL}/predictor/publicpredictors`, { headers: this.authService.authHeader() });
  }
  getPredictor(id : String): Observable<Predictor> {
    return this.http.get<Predictor>(`${API_SETTINGS.apiURL}/predictor/getpredictor/`+ id, { headers: this.authService.authHeader() });
  }

  usePredictor(predictor: Predictor, inputs : String[]) {
    return this.http.post(`${API_SETTINGS.apiURL}/predictor/usepredictor/` + predictor._id, inputs, { headers: this.authService.authHeader() });
  }

  deletePredictor(predictor: Predictor) {
    return this.http.delete(`${API_SETTINGS.apiURL}/predictor/` + predictor.name, { headers: this.authService.authHeader(), responseType: "text" });
  }

  getMyPredictors(): Observable<Predictor[]> {
    return this.http.get<Predictor[]>(`${API_SETTINGS.apiURL}/predictor/mypredictors`, { headers: this.authService.authHeader() });
  }
}
