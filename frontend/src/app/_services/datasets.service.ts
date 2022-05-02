import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from './configuration.service';
import Dataset from '../_data/Dataset';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DatasetsService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getPublicDatasets(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>(`${Configuration.settings.apiURL}/dataset/publicdatasets`, { headers: this.authService.authHeader() });
  }

  getMyDatasets(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>(`${Configuration.settings.apiURL}/dataset/mydatasets`, { headers: this.authService.authHeader() });
  }

  addDataset(dataset: Dataset): Observable<any> {
    return this.http.post(`${Configuration.settings.apiURL}/dataset/add`, dataset, { headers: this.authService.authHeader() });
  }

  getDatasetFile(fileId: any): any {
    return this.http.get(`${Configuration.settings.apiURL}/file/csvRead/${fileId}`, { headers: this.authService.authHeader(), responseType: 'text' });
  }
  getDatasetFilePartial(fileId: any, startRow: number, rowNum: number): Observable<any> {
    return this.http.get(`${Configuration.settings.apiURL}/file/csvRead/${fileId}/${startRow}/${rowNum}`, { headers: this.authService.authHeader(), responseType: 'text' });
  }

  editDataset(dataset: Dataset): Observable<Dataset> {
    return this.http.put<Dataset>(`${Configuration.settings.apiURL}/dataset/` + dataset._id, dataset, { headers: this.authService.authHeader() });
  }

  deleteDataset(dataset: Dataset) {
    return this.http.delete(`${Configuration.settings.apiURL}/dataset/` + dataset._id, { headers: this.authService.authHeader(), responseType: "text" });
  }
}
