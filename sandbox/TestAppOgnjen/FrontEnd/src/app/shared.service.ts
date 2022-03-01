import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
readonly APIUrl="http://localhost:5000/api";
  constructor(private http:HttpClient) { }


  getToDoList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/ToDo');
  }
  addToDo(val:any){
    return this.http.post(this.APIUrl+'/ToDo',val);
  }
  updateToDo(val:any,id:any){
    return this.http.put(this.APIUrl+'/ToDo/'+id,val);
  }
  deleteToDo(val:any){
    return this.http.delete(this.APIUrl+'/ToDo/'+val);
  }
}
