import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import API_SETTINGS from '../../config.json';
import User from '../_data/User';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserInfo(): Observable<User> {
    return this.http.get<User>(`${API_SETTINGS.apiURL}/user/myprofile`, { headers: this.authService.authHeader() });
  }

  changeUserInfo(user: User): any {
    return this.http.put(`${API_SETTINGS.apiURL}/user/changeinfo`, user, { headers: this.authService.authHeader() });
  }

  changeUserPassword(passwordArray: string[]): any {
    return this.http.put(`${API_SETTINGS.apiURL}/user/changepass`, passwordArray, { headers: this.authService.authHeader(), responseType: 'text' });
  }

  deleteUser(): any {
    return this.http.delete(`${API_SETTINGS.apiURL}/user/deleteprofile`, { headers: this.authService.authHeader() });
  }
}
