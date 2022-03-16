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
      reportProgress: true,
    };

    const req = new HttpRequest('POST', `${API_SETTINGS.apiURL}/file/csv`, formData, options);
    return this.http.request(req);
  }

  addModel(model: Model) {
    return this.http.post(`${API_SETTINGS.apiURL}/model/sendModel`, model, { headers: this.authService.authHeader(), responseType: 'text' });
  }
  addDataset(dataset: Dataset) {
    return this.http.post(`${API_SETTINGS.apiURL}/model/uploadDataset`, dataset, { headers: this.authService.authHeader(), responseType: 'text' });
  }
}
