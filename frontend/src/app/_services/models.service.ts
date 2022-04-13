import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Model from '../_data/Model';
import { AuthService } from './auth.service';
import API_SETTINGS from '../../config.json';
import { Observable } from 'rxjs';
import Dataset from '../_data/Dataset';


@Injectable({
  providedIn: 'root'
})
export class ModelsService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  uploadData(file: File): Observable<any> {
    let formData = new FormData();
    formData.append('file', file, file.name);

    let params = new HttpParams();

    const options = {
      params: params,
      reportProgress: false,
      headers: this.authService.authHeader()
    };

    return this.http.post(`${API_SETTINGS.apiURL}/file/csv`, formData, options);
  }

  addModel(model: Model): Observable<any> {
    return this.http.post(`${API_SETTINGS.apiURL}/model/add`, model, { headers: this.authService.authHeader() });
  }
  addDataset(dataset: Dataset): Observable<any> {
    return this.http.post(`${API_SETTINGS.apiURL}/dataset/add`, dataset, { headers: this.authService.authHeader() });
  }
  trainModel(modelId: string, experimentId: string): Observable<any> {
    return this.http.post(`${API_SETTINGS.apiURL}/model/trainmodel`, { ModelId: modelId, ExperimentId: experimentId }, { headers: this.authService.authHeader(), responseType: 'text' });
  }

  getMyDatasets(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>(`${API_SETTINGS.apiURL}/dataset/mydatasets`, { headers: this.authService.authHeader() });
  }

  getMyModels(): Observable<Model[]> {
    return this.http.get<Model[]>(`${API_SETTINGS.apiURL}/model/mymodels`, { headers: this.authService.authHeader() });
  }

  editModel(model: Model): Observable<Model> {
    return this.http.put<Model>(`${API_SETTINGS.apiURL}/model/`, model, { headers: this.authService.authHeader() });
  }

  deleteModel(model: Model) {
    return this.http.delete(`${API_SETTINGS.apiURL}/model/` + model.name, { headers: this.authService.authHeader(), responseType: "text" });
  }
}
