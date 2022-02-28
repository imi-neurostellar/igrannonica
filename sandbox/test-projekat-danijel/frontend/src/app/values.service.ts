import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValuesService {

  constructor(private http: HttpClient) { }

  getColors() {
    return this.http.get<string[]>(`http://localhost:5000/api/values/`);
  }

  addColor(red: number, green: number, blue: number) {
    let header: HttpHeaders = new HttpHeaders({
      'Content-type': 'application/json',
    });
    return this.http.post(`http://localhost:5000/api/values/`, { red, green, blue }, { headers: header, responseType: 'text' });
  }
}
