import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import * as moment from 'moment';
import {ErrorStateMatcher} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
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
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  fromdate = new FormControl(new Date());
  todate = new FormControl(new Date());
  

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
    this.subtype = "betweenDate";
    this.viewData();
  }

  async viewData(){
    var fromdate = moment(this.fromdate.value).startOf('day').format();
    var todate = moment(this.todate.value).endOf('day').format();
    var requestData = {
      "pageIndex": this.pageIndex,
      "pageSize": this.pageSize,
      "type": this.type,
      "subtype": this.subtype,
      "fromdate": fromdate,
      "todate": todate
    }
    // console.log(requestData)
    var responseData = await this.reportService.getReport(requestData);
    this.dataSource = responseData.data.dataSource;
    this.length = responseData.data.length;
  }

  getServerData(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.viewData();
  }
}
