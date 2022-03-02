import { Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Student } from '../Student';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.css']
})
export class AddPageComponent implements OnInit {

  submitted = false;

  constructor(private studentService: StudentService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
  }

  handleSave(f: NgForm) {
    let newStudent : Student = {
      id : -1,
      firstName: f.value.firstname, //znaci ovo je name iz forme
      lastName: f.value.lastname,
      regNum: f.value.regNum,
      address: f.value.address,
      phoneNum: f.value.phone,
      gpa: 0.0
    }
    console.log(newStudent);

    this.studentService.addStudent(newStudent)
      .subscribe(
        data => {
          this.submitted = true;
          this.router.navigate(['']);
        }
      );
  }

}
