import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Model from '../_data/Model';
import { AuthService } from './auth.service';
import { API_SETTINGS } from 'src/config';
import Dataset from '../_data/Dataset';
import { Observable } from 'rxjs';


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
  trainModel(modelId: string): Observable<any> {
    return this.http.post(`${API_SETTINGS.apiURL}/model/train`, modelId, { headers: this.authService.authHeader() });
  }

  getMyDatasets(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>(`${API_SETTINGS.apiURL}/dataset/mydatasets`, { headers: this.authService.authHeader() });
  }
  
  getMyModels(): Observable<Model[]> {
    return this.http.get<Model[]>(`${API_SETTINGS.apiURL}/model/mymodels`, { headers: this.authService.authHeader() });
  }

  editModel(model:Model) : Observable<Model>
  {
    return this.http.put<Model>(`${API_SETTINGS.apiURL}/model/`, model, { headers: this.authService.authHeader() });
  }

  deleteModel(model:Model) : Observable<any>
  {
    return this.http.delete(`${API_SETTINGS.apiURL}/model/`+model.name, { headers: this.authService.authHeader() });
  }
}
