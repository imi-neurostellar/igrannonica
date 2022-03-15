import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Model from '../_data/Model';
import { AuthService } from './auth.service';
import { API_SETTINGS } from 'src/config';


@Injectable({
  providedIn: 'root'
})
export class ModelsService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  addModel(model: Model) {
    return this.http.post(`${API_SETTINGS.apiURL}/model/sendModel`, model, { headers: this.authService.authHeader(), responseType: 'text' });
  }
}
