import { Component, OnInit } from '@angular/core';
import { TaskService } from "src/api/task/task.service";
@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {

  task:string;
  spin:number;
  maxclick:number;
  maxtimeclick:number;
  mintimeclick:number;
  clicktimer:number;
  isClick:boolean;
    
  constructor(private taskService:TaskService) {}

  ngOnInit() {
     this.clearData();
  }

  async onNewTask(){
    var requestBody = {
      task: this.task,
      spin: this.spin,
      maxclick: this.maxclick,
      maxtimeclick: this.maxtimeclick,
      mintimeclick: this.mintimeclick,
      clicktimer: this.clicktimer,
      isClick: this.isClick
    }
    var responseData = await this.taskService.addTask(requestBody);
    if (responseData.code == 1) {
     this.clearData();
    } else {
      
    }
  }

  clearData(){
    this.task = "";
    this.spin = null;
    this.maxclick = null;
    this.maxtimeclick = null;
    this.mintimeclick = null;
    this.clicktimer = null;
    this.isClick = false;
  }

  onChange(event, isClick) {
    this.isClick = isClick;
    console.log(event, isClick)
  }

}
