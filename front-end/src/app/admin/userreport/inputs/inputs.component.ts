import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReportService } from 'src/api/report/report.service';

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
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss']
})

export class InputsComponent implements OnInit {


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
    this.subtype = "day";
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
    this.dataSource = responseData.data.dataSource;
    this.length = responseData.data.length;
  }

  getServerData(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.initReportUser();
  }

}

