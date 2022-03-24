import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { API_SETTINGS } from 'src/config';
import shared from '../Shared';

const jwtHelper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  shared = shared;

  constructor(private http: HttpClient, private cookie: CookieService) { }

  login(username: string, password: string) {
    return this.http.post(`${API_SETTINGS.apiURL}/auth/login`, { username, password }, { responseType: 'text' });
  }

  register(user: any) {
    return this.http.post(`${API_SETTINGS.apiURL}/auth/register`, { ...user }, { responseType: 'text' });
  }

  isAuthenticated(): boolean {
    if (this.cookie.check('token')) {
      var token = this.cookie.get('token');
      return !jwtHelper.isTokenExpired(token);
    }
    return false;
  }

  lastToken?: string;
  refresher: any;

  enableAutoRefresh() {
    this.lastToken = this.cookie.get('token');
    let exp = jwtHelper.getTokenExpirationDate(this.lastToken);
    if (!exp) {
      exp = new Date();
    }
    this.refresher = setTimeout(() => {
      console.log('refreshing token!');
      this.http.post(`${API_SETTINGS.apiURL}/auth/renewJwt`, {}, { headers: this.authHeader(), responseType: 'text' }).subscribe((response) => {
        this.authenticate(response);
      });
    }, exp.getTime() - new Date().getTime() - 60000);
  }

  authenticate(token: string) {
    let exp = jwtHelper.getTokenExpirationDate(token);
    if (!exp) {
      exp = new Date();
    }
    this.cookie.set('token', token, exp);
    this.updateUser();
  }

  updateUser() {
    if (this.cookie.check('token')) {
      const token = this.cookie.get('token');
      const decodedToken = jwtHelper.decodeToken(token);
      console.log("decoded:", decodedToken);
      this.shared.loggedIn = this.isAuthenticated();
      this.shared.username = decodedToken.name;
      this.enableAutoRefresh();
    }
  }

  logOut() {
    this.cookie.delete('token');
    if (this.refresher)
      clearTimeout(this.refresher);
    this.shared.loggedIn = false;
  }

  authHeader() {
    return new HttpHeaders().set("Authorization", "Bearer " + this.cookie.get('token'));
  }
}
