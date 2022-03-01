import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Serve1Service {

  constructor(private http: HttpClient) { }

  /*getNumbers() {
    return this.http.get<string[]>(`http://localhost:5000/api/kontroler/`);
  }*/

  sendNumbers(a: number, b: number) {
    let header: HttpHeaders = new HttpHeaders({
      'Content-type': 'application/json',
    });
    return this.http.post(`http://localhost:5000/api/kontroler/`, {a, b }, { headers: header, responseType: 'text' });
  }
}
