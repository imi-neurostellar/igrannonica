import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { NgModule } from '@angular/core';
@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  constructor(private service:SharedService) { }

  ToDoList:any=[];
  TaskName:string="ime taska";
  isDone:boolean=false;


  ngOnInit(): void {
    this.refreshToDoList();
  }



  editToDo(item:any){
    var done=1;
    if(item.done==1)
      done=0;
    var val={id:item.id,
            task:item.task,
            done:done};
    this.service.updateToDo(val,item.id).subscribe(data=>{
      this.refreshToDoList();
    });

  }
  deleteToDo(item:any){
    if(confirm("Da li stvarno zelite da obrisete "+item.task))
    this.service.deleteToDo(item.id).subscribe(data=>{
    this.refreshToDoList();
    });
    
  }
  addToDo(){
    var done=0;
    if(this.isDone)
    done=1;
    var val={task:this.TaskName,
            done:done};
    this.service.addToDo(val).subscribe(data=>{
      this.refreshToDoList();
    })

  }

  refreshToDoList(){
    this.service.getToDoList().subscribe(data=>{
      this.ToDoList=data;
    });
  }
}
