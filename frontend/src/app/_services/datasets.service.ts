import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_SETTINGS } from 'src/config';
import Dataset from '../_data/Dataset';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DatasetsService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getPublicDatasets(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>(`${API_SETTINGS.apiURL}/Dataset/publicdatasets`, { headers: this.authService.authHeader() });
  }
}
