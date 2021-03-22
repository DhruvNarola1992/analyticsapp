import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/api/report/report.service';
import { MatDialog } from '@angular/material/dialog';


export interface UserReportData {
  "_id" : string;
  
  "totalimpression" : number;
  "successimpression" : number;
  "failimpression" : number;
  "coinimpression" : number;
  
  "totalclick" : number;
  "successclick" : number;
  "failclick" : number;
  "coinclick" : number;
  
  "scratchcount" : number;
  "coinscratch" : number;
  
  "spincount" : number;
  "coinspin" : number;
  
  "gamecount" : number;
  "coinplaygame" : number;
  
  "coinreference" : number;
  
  "withdrawcoin" : number;
  "withdrawamount" : number;
  
  "todayassigntask" : number;
  "todayassignclick" : number;
  
  "todayregister" : number;
  "todaylogin" : number;
  }

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {

  dataSource;
  displayedColumns: string[] = ['index', 'date' , 'register' , 'login' , 'earn' , 'withdraw']; // ,'imp', 'click', 'scratch', 'spin', 'game', 'reference', 'withdraw', 'task', 'active'];
  //pagination 
  pageIndex: number;
  pageSize: number;
  length: number;
  //type --fix
  type: string;
  subtype: string;

  constructor(public reportService: ReportService, public matDialog: MatDialog) { }

  ngOnInit() {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.type = "user";
    this.subtype = "week";
    this.initReportUser();
  }

  async initReportUser() {
    //Server data -- get total length
    var requestData = {
      "pageIndex": this.pageIndex,
      "pageSize": this.pageSize,
      "type": this.type,
      "subtype": this.subtype
    }
    // console.log(requestData)
    var responseData = await this.reportService.getReport(requestData);
    console.log(responseData)
    this.dataSource = responseData.data.dataSource;
    this.length = responseData.data.length[0].totalCount;
  }

  getServerData(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.initReportUser();
  }

}
