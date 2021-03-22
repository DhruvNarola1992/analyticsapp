import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/api/report/report.service';
import { Observable } from 'rxjs';

export interface UserReportData {
  "_id"?: string;

  "totalimpression"?: number;
  "successimpression"?: number;
  "failimpression"?: number;
  "coinimpression"?: number;

  "totalclick"?: number;
  "successclick"?: number;
  "failclick"?: number;
  "coinclick"?: number;

  "scratchcount"?: number;
  "coinscratch"?: number;

  "spincount"?: number;
  "coinspin"?: number;

  "gamecount"?: number;
  "coinplaygame"?: number;

  "coinreference"?: number;

  "withdrawcoin"?: number;
  "withdrawamount"?: number;

  "todayassigntask"?: number;
  "todayassignclick"?: number;

  "todayregister"?: number;
  "todaylogin"?: number;
}

export interface WithdrawReport {
  "_id"?: string;
  "coin"?: number;
  "amount"?: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  report: UserReportData;
  withdraw: WithdrawReport[];
  constructor(public reportService: ReportService) { }
  async ngOnInit() {
    var requestData = {
      "pageIndex": 0,
      "pageSize": 0,
      "type": "user",
      "subtype": ""
    }
    // console.log(requestData)
    var responseData = await this.reportService.getReport(requestData);
    this.report = responseData.data.dataSource[0];
    let arrayGet = [];
    if (responseData.data.length.length > 0) {
      for (let index = 0; index < responseData.data.length.length; index++) {
        let objectWithdraw = {}
        const element = responseData.data.length[index]._id;
        if (element == "SUCCESS") {
          objectWithdraw['_id'] = responseData.data.length[index]._id;
          objectWithdraw['coin'] = responseData.data.length[index].coin;
          objectWithdraw['amount'] = responseData.data.length[index].amount;
        } else if (element == "CANCEL") {
          objectWithdraw['_id'] = responseData.data.length[index]._id;
          objectWithdraw['coin'] = responseData.data.length[index].coin;
          objectWithdraw['amount'] = responseData.data.length[index].amount;
        } else if (element == "PENDING") {
          objectWithdraw['_id'] = responseData.data.length[index]._id;
          objectWithdraw['coin'] = responseData.data.length[index].coin;
          objectWithdraw['amount'] = responseData.data.length[index].amount;
        }
        arrayGet.push(objectWithdraw)
      }
    }
    if(arrayGet.length < 3) {
      var filterSuccess = await arrayGet.filter(data => { return data._id == "SUCCESS" });
      var filterCacel = await arrayGet.filter(data => { return data._id == "CANCEL" });
      var filterPending = await arrayGet.filter(data => { return data._id == "PENDING" });
      if(filterSuccess.length == 0) {
        let objectWithdraw = {}
        objectWithdraw['_id'] = "SUCCESS";
        objectWithdraw['coin'] = 0;
        objectWithdraw['amount'] = 0;
        arrayGet.push(objectWithdraw)
      }
      if(filterCacel.length == 0) {
        let objectWithdraw = {}
        objectWithdraw['_id'] = "CANCEL";
        objectWithdraw['coin'] = 0;
        objectWithdraw['amount'] = 0;
        arrayGet.push(objectWithdraw)
      }
      if(filterPending.length == 0) {
        let objectWithdraw = {}
        objectWithdraw['_id'] = "PENDING";
        objectWithdraw['coin'] = 0;
        objectWithdraw['amount'] = 0;
        arrayGet.push(objectWithdraw)
      }
    }
    this.withdraw = arrayGet;
  }


}
