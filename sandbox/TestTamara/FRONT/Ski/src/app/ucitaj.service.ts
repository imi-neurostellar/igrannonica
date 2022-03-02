import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UcitajService {

  constructor(private http:HttpClient) { }
  dajPoruku(){
    return this.http.get("http://localhost:5000/api/ski",{responseType:'text'});
  }
}

