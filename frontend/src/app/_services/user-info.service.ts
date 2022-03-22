import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_SETTINGS } from 'src/config';
import User from '../_data/User';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUsersInfo(): Observable<User> {
    return this.http.get<User>(`${API_SETTINGS.apiURL}/user/myprofile`, { headers: this.authService.authHeader() });
  }

  changeUserInfo(user: User): any {
    return this.http.put(`${API_SETTINGS.apiURL}/user/${user._id}`, user, { headers: this.authService.authHeader() });
  }

  changeUserPassword(oldPassword: string, newPassword: string): Observable<User> {
    return this.http.put<User>(`${API_SETTINGS.apiURL}/user/`, { oldPassword, newPassword }, { headers: this.authService.authHeader() });
  }
}
