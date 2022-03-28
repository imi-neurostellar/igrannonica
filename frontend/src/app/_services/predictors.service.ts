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

}
