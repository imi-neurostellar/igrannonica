import { Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.service';
import { Student } from '../Student';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  public students: Student[] = [];
  submitted = false;
  count: number = 0;

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.studentService
      .getStudents()
      .subscribe((students : Student[]) => this.students = students);
  }

  pickStudentForDelete(id: number) {
    this.studentService.deleteStudent(id)
      .subscribe(
        data => {
          this.submitted = true;
          this.ngOnInit();
          //console.log("Data: " + data);
        }
      );
  }

}
