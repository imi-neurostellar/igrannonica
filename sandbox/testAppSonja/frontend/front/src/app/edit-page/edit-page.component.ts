import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../services/student.service';
import { Student } from '../Student';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {

  submitted = false;
  id: number = -1;
  student = new Student();

  constructor(private studentService: StudentService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => this.id = parseInt(params.get('id')!)
      );
    
      this.loadOneStudent();
  }

  loadOneStudent() {
    this.studentService.getOneStudent(this.id)
      .subscribe(
        data => this.student = data
      )
  }

  handleSubmit(f: NgForm) { //f.value su name-ovi pokupljeni iz forme pa njihove vrednosti
    let editedStudent : Student = {
      id: f.value.id,
      firstName: f.value.firstname, //znaci ovo je name iz forme
      lastName: f.value.lastname,
      regNum: f.value.regNum,
      address: f.value.address,
      phoneNum: f.value.phone,
      gpa: f.value.gpa
    }
    
    this.studentService.updateStudent(this.id, editedStudent)
      .subscribe(
        data => {
          this.submitted = true;
          //console.log("Form:", f.value);
          this.router.navigate(['']);
        }
      )
  }

}
