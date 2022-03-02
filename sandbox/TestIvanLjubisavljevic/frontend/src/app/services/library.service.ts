import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Laptop } from '../models/laptop';

@Injectable({
  providedIn: 'root'
})

export class LibraryServiceService    {
  
  constructor(private http:HttpClient) { }

  //DAJ SVE LAPTOPOVE
  dajLaptopove(): Observable<Laptop[]>
  {
      return this.http.get<Laptop[]>("http://localhost:5000/api/sviLaptopovi");
  }

  //DAJ ODREDJENI LAPTOP
  dajLaptop(id:String): Observable<Laptop>
  {
    return this.http.get<Laptop>("http://localhost:5000/api/laptop/"+id);
  }

  //UNESI NOVI LAPTOP
  unesiLaptop(reqBody:Laptop): Observable<Laptop>
  {
    return this.http.post<Laptop>("http://localhost:5000/api/add", 
    {"brand": reqBody.brand,
    "model": reqBody.model,
    "ram": reqBody.ram,
    "hdd": reqBody.hdd,
    "graphics": reqBody.graphics,
    "price":reqBody.price,
    "display" : reqBody.display,
    "id": "a873b90f-5fca-4c41-a00e-8ea497cce542",
    "processor": reqBody.processor});
  }

  //IZMENI LAPTOP
  izmeniLaptop(reqBody?:Laptop): Observable<Laptop>
  {
    return this.http.put<Laptop>("http://localhost:5000/api/update", 
    {"brand": reqBody?.brand,
    "model": reqBody?.model,
    "ram": reqBody?.ram,
    "hdd": reqBody?.hdd,
    "graphics": reqBody?.graphics,
    "price":reqBody?.price,
    "display" : reqBody?.display,
    "processor": reqBody?.processor,
  "id":reqBody?.id});
  }

  //OBRISI LAPTOP
  obrisiLaptop(id:String): Observable<Boolean>
  {
    return this.http.delete<Boolean>("http://localhost:5000/api/brisanje/"+id);
  }
}