import { Component, OnInit } from '@angular/core';
import { PaymentService } from "src/api/withdraw/withdraw.service";
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {

  dataSource;
  displayedColumns: string[] = ['index', 'mobileNo', 'coin', 'amount' , 'name' , 'createDate'];
  //pagination 
  pageIndex: number;
  pageSize: number;
  totalLength: number;
  length: number;
  //sorting
  active: string;
  direction: string;
  //search
  filterMobilno: string;
  //type --fix
  type: string; 
  
  constructor(public paymentService: PaymentService, public matDialog: MatDialog) { }

  ngOnInit() {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.filterMobilno = "";
    this.active = "createDate";
    this.direction = "desc";
    this.type = "cancel";
    this.initWithdraw();
  }

  async initWithdraw() {
    //Server data -- get total length
    var requestData = {
      "pageIndex":this.pageIndex,
      "pageSize":this.pageSize,
      "filterMobilno":this.filterMobilno,
      "active":this.active,
      "direction":this.direction,
      "type": this.type
    }
    var responseData = await this.paymentService.getAllWithdraw(requestData);
    this.dataSource = responseData.data.dataSource;
    this.length = responseData.data.length;
  }

  getServerData(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize; 
    this.initWithdraw();
  }

  sortWithdraw(event){
    this.active = event.active;
    this.direction = this.direction;
    this.direction = event.direction;
    if(event.direction == "") {
      this.direction = "asc";
    }
  }

  applyFilter(filterValue: string) {
    this.filterMobilno = filterValue.trim();
    this.initWithdraw();
  }

}
