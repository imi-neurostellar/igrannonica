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
    return this.http.get<Dataset[]>(`${API_SETTINGS.apiURL}/dataset/publicdatasets`, { headers: this.authService.authHeader() });
  }

  getMyDatasets(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>(`${API_SETTINGS.apiURL}/dataset/mydatasets`, { headers: this.authService.authHeader() });
  }

  addDataset(dataset: Dataset): Observable<any> {
    return this.http.post(`${API_SETTINGS.apiURL}/dataset/add`, dataset, { headers: this.authService.authHeader() });
  }

  getDatasetFile(fileId: any): any {
    return this.http.get(`${API_SETTINGS.apiURL}/file/download?id=${fileId}`, { headers: this.authService.authHeader(), responseType: 'text' });
  }
}
