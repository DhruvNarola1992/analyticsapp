import { Component, OnInit } from '@angular/core';
import { ApplicationService } from 'src/api/application/app.service';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {

  uan: string;
  name:string;
  icon:string;
  url: string;
  msg: string; 
  taskclickpercentage: number;

  constructor(private applicationService:ApplicationService) {}

  ngOnInit() {
   this.clearData();
  }

  async onNewApplication(){
    var requestBody = {
      unappname:this.uan,
      name:this.name,
      icon:this.icon,
      url:this.url,
      msg:this.msg,
      taskclickpercentage:this.taskclickpercentage
    }
    var responseData = await this.applicationService.addApplication(requestBody);
    if (responseData.code == 1) {
     this.clearData();
    } else {
      
    }
  }

  clearData(){
    this.uan="";
    this.name="";
    this.icon="";
    this.url="";
    this.msg="";
    this.taskclickpercentage=null;
  }

}
