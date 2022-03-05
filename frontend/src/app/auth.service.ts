import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { API_SETTINGS } from 'src/config';

const jwtHelper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private cookie: CookieService) { }

  login(username: string, password: string) {
    return this.http.post(`${API_SETTINGS.apiURL}/login`, { username, password });
  }

  register(username: string, password: string) {
    return this.http.post(`${API_SETTINGS.apiURL}/register`, { username, password });
  }

  isAuthenticated(): boolean {
    if (this.cookie.check('token')) {
      var token = this.cookie.get('token');
      return !jwtHelper.isTokenExpired(token);
    }
    return false;
  }
}
