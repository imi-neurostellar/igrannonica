import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../Student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  public getStudents() {
    return this.http.get<Student[]>(`http://localhost:5000/api/students`);
  }

  public getOneStudent(id: number) {
    return this.http.get<any>("http://localhost:5000/api/students/" + id);
  }

  public updateStudent(id: number, student: Student) {
    return this.http.put("http://localhost:5000/api/students/" + student.id, student);
  }

  public deleteStudent(id: number) {
    return this.http.delete("http://localhost:5000/api/students/" + id);
  }

  public addStudent(newStudent: Student) {
    return this.http.post("http://localhost:5000/api/students/", newStudent);
  }
}
