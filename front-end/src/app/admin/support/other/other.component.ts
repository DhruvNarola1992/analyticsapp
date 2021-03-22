import { Component, OnInit, Inject, ViewChild, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/api/user/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PaymentService } from 'src/api/withdraw/withdraw.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
export interface User {
  "_id": string;
  "createDate"?: string;
  "coin"?: number;
  "amount"?: number;
  "mobileNo"?: string;
  "name"?: string;
  "totalcoin"?: number;
  "totalamount"?: number;
  "convertCoin"?: number;
  "convertAmount"?: number;
  "referCode"?: string;
  "reference"?: string;
  "uniqueId"?: string;
  "isActive"?: boolean;
  "isFirstWithdraw"?: boolean;
  "getreferCoin"?: number;
  "totalimpression"?: number;
  "totalclick"?: number;
  "successimpression"?: number;
  "failimpression"?: number;
  "successclick"?: number;
  "failclick"?: number;
  "scratchcount"?: number;
  "spincount"?: number;
  "gamecount"?: number;
  "coinimpression"?: number;
  "coinclick"?: number;
  "coinscratch"?: number;
  "coinspin"?: number;
  "coinreference"?: number;
  "coinplaygame"?: number;
}
@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent  {

  dataSource;
  displayedColumns: string[] = ['index', 'mobileNo', 'name', 'coin', 'amount', 'totalcoin', 'totalamount', 'createDate', 'time', 'actions'];
  //pagination 
  pageIndex: number;
  pageSize: number;
  length: number;
  //sorting
  active: string;
  direction: string;
  //search
  filterMobilno: string;
  //type --fix
  isActive: boolean;

  rowData: User;

  constructor(public userService: UserService, public matDialog: MatDialog) { }

  ngOnInit() {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.filterMobilno = "";
    this.active = "createDate";
    this.direction = "desc";
    this.isActive = false;
    this.initUser();

  }

  async initUser() {
    //Server data -- get total length
    var requestData = {
      "pageIndex": this.pageIndex,
      "pageSize": this.pageSize,
      "filterMobilno": this.filterMobilno,
      "active": this.active,
      "direction": this.direction,
      "isActive": this.isActive
    }
    // console.log(requestData)
    var responseData = await this.userService.getAllUser(requestData);
    this.dataSource = responseData.data.dataSource;
    this.length = responseData.data.length;
  }

  getServerData(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.initUser();
  }

  sortWithdraw(event) {
    this.active = event.active;
    this.direction = event.direction;
    if (event.direction == "") {
      this.direction = "asc";
    }
    this.initUser();
  }

  applyFilter(filterValue: string) {
    this.filterMobilno = filterValue.trim();
    this.initUser();
  }

  async userActivity(show) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(DeactiveUserActivityHistoryDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData._id
      }
    });
  }

  async userPaymentHistory(show) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(DeActiveHistoryWithdrawDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData._id,
        "mobileNo": this.rowData.mobileNo
      }
    });
  }

  async userActive(show, index) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(EditDeActiveUserDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData._id,
        "mobileNo": this.rowData.mobileNo,
      }
    });

    dialogRef.afterClosed().pipe().subscribe(result => {
      this.initUser();
    });
  }

  async userScratch(show) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(DeActiveUserDailyScratchHistoryDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData._id
      }
    });
  }

  async userTaskSpin(show) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(DeActiveUserDailyTaskSpinDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData._id
      }
    });
  }

  async userApplication(show) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(DeActiveUserApplicationDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData._id
      }
    });
  }

  async userMoredetail(show) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(DeActiveUserMoreDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData._id
      }
    });
  }

}

@Component({
  selector: 'user-deactivity-history-dialog',
  templateUrl: 'activity-user.html',
})

export class DeactiveUserActivityHistoryDialog implements OnInit {
  dataSource;
  displayedColumns: string[] = ['index', 'uan', 'type', 'coin', 'flag', 'createDate', 'time'];
  //pagination 
  pageIndexWithdraw: number;
  pageSizeWithdraw: number;
  lengthWithdraw: number;
  //Find Withdraw Activity
  userId: string;

  constructor(public dialogRef: MatDialogRef<DeactiveUserActivityHistoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User, private paymentService: PaymentService) {
  }

  ngOnInit() {
    this.pageIndexWithdraw = 0;
    this.pageSizeWithdraw = 10;
    this.userId = this.data._id;
    this.initWithdrawHistory();
  }

  async initWithdrawHistory() {
    //Server data -- get total length
    var requestData = {
      "pageIndex": this.pageIndexWithdraw,
      "pageSize": this.pageSizeWithdraw,
      "userId": this.userId
    }
    // console.log(requestData)
    var responseData = await this.paymentService.activityHistoryUser(requestData);
    this.dataSource = responseData.data.dataSource;
    this.lengthWithdraw = responseData.data.length;
  }

  async getServerData(event) {
    this.pageIndexWithdraw = event.pageIndex;
    this.pageSizeWithdraw = event.pageSize;
    this.initWithdrawHistory();
  }

}

@Component({
  selector: 'deactiveuser-withdraw-history-dialog',
  templateUrl: 'history-payment.html',
})

export class DeActiveHistoryWithdrawDialog implements OnInit {
  dataSource;
  displayedColumns: string[] = ['index', 'coin', 'amount', 'status', 'createDate', 'time'];
  //pagination 
  pageIndexWithdraw: number;
  pageSizeWithdraw: number;
  lengthWithdraw: number;
  //Find Withdraw Activity
  mobileNo: string;

  constructor(public dialogRef: MatDialogRef<DeActiveHistoryWithdrawDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User, private paymentService: PaymentService) {
  }

  ngOnInit() {
    this.pageIndexWithdraw = 0;
    this.pageSizeWithdraw = 10;
    this.mobileNo = this.data.mobileNo;
    this.initWithdrawHistory();
  }

  async initWithdrawHistory() {
    //Server data -- get total length
    var requestData = {
      "pageIndex": this.pageIndexWithdraw,
      "pageSize": this.pageSizeWithdraw,
      "mobileNo": this.mobileNo
    }
    // console.log(requestData)
    var responseData = await this.paymentService.withdrawHistoryUser(requestData);
    this.dataSource = responseData.data.dataSource;
    this.lengthWithdraw = responseData.data.length;
  }

  async getServerData(event) {
    this.pageIndexWithdraw = event.pageIndex;
    this.pageSizeWithdraw = event.pageSize;
    this.initWithdrawHistory();
  }

}


@Component({
  selector: 'deactiveuser-edit-dialog',
  templateUrl: 'active-user.html',
})

export class EditDeActiveUserDialog implements OnInit {
  form: FormGroup;

  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<EditDeActiveUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User, private paymentService: PaymentService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      "userId": this.data._id,
      "mobileNo": this.data.mobileNo,
      "isActive": false,
      "status": ""
    })
  }

  async updateUser(form) {
    var data = await this.paymentService.updateUserDeactive(form.value);
    if (data.code == 1) {
      this.dialogRef.close(data.data);
    } else {

    }
  }

  onChange(event) {
    this.form.patchValue({
      isActive: event.checked
    })
  }
}

@Component({
  selector: 'deuser-daily-scratch-dialog',
  templateUrl: 'daily-scratch.html',
})

export class DeActiveUserDailyScratchHistoryDialog implements OnInit {
  dataSource;
  displayedColumns: string[] = ['index', 'uan', 'scratchimage', 'totalCard', 'currentCard'];
  //pagination 
  pageIndexWithdraw: number;
  pageSizeWithdraw: number;
  lengthWithdraw: number;
  //Find Withdraw Activity
  userId: string;

  constructor(public dialogRef: MatDialogRef<DeActiveUserDailyScratchHistoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User, private userService: UserService) {
  }

  ngOnInit() {
    this.pageIndexWithdraw = 0;
    this.pageSizeWithdraw = 10;
    this.userId = this.data._id;
    this.initUserScratch();
  }

  async initUserScratch() {
    //Server data -- get total length
    var requestData = {
      "pageIndex": this.pageIndexWithdraw,
      "pageSize": this.pageSizeWithdraw,
      "userId": this.userId
    }
    console.log(requestData)
    var responseData = await this.userService.getTodayScratchAssignByUser(requestData);
    this.dataSource = responseData.data.dataSource;
    this.lengthWithdraw = responseData.data.length;
  }

  async getServerData(event) {
    this.pageIndexWithdraw = event.pageIndex;
    this.pageSizeWithdraw = event.pageSize;
    this.initUserScratch();
  }

}

@Component({
  selector: 'deactiveuser-daily-task-dialog',
  templateUrl: 'daily-task.html',
})

export class DeActiveUserDailyTaskSpinDialog implements OnInit {
  dataSource;
  displayedColumns: string[] = ['index', 'uan', 'task', 'currenttask', 'spin', 'currentspin'];
  //pagination 
  pageIndexWithdraw: number;
  pageSizeWithdraw: number;
  lengthWithdraw: number;
  //Find Withdraw Activity
  userId: string;

  constructor(public dialogRef: MatDialogRef<DeActiveUserDailyTaskSpinDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User, private userService: UserService) {
  }

  ngOnInit() {
    this.pageIndexWithdraw = 0;
    this.pageSizeWithdraw = 10;
    this.userId = this.data._id;
    this.initUserSpinTask();
  }

  async initUserSpinTask() {
    //Server data -- get total length
    var requestData = {
      "pageIndex": this.pageIndexWithdraw,
      "pageSize": this.pageSizeWithdraw,
      "userId": this.userId
    }
    console.log(requestData)
    var responseData = await this.userService.getTodaySpinTaskAssignByUser(requestData);
    this.dataSource = responseData.data.dataSource;
    this.lengthWithdraw = responseData.data.length;
  }

  async getServerData(event) {
    this.pageIndexWithdraw = event.pageIndex;
    this.pageSizeWithdraw = event.pageSize;
    this.initUserSpinTask();
  }

}

@Component({
  selector: 'deactiveuser-application-dialog',
  styleUrls: ['application-user.css'],
  templateUrl: 'application-user.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class DeActiveUserApplicationDialog implements OnInit {
  dataSource;
  displayedColumns: string[] = ['icon', 'uan', 'coin', 'totalcoin'];
  //pagination 
  pageIndexWithdraw: number;
  pageSizeWithdraw: number;
  lengthWithdraw: number;
  //Find Withdraw Activity
  userId: string;
  expandedElement: any | null;
  constructor(public dialogRef: MatDialogRef<DeActiveUserApplicationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User, private userService: UserService) {
  }

  ngOnInit() {
    this.pageIndexWithdraw = 0;
    this.pageSizeWithdraw = 10;
    this.userId = this.data._id;
    this.initUserByApp();
  }

  async initUserByApp() {
    //Server data -- get total length
    var requestData = {
      "pageIndex": this.pageIndexWithdraw,
      "pageSize": this.pageSizeWithdraw,
      "userId": this.userId
    }

    var responseData = await this.userService.getUserByApplication(requestData);
    this.dataSource = responseData.data.dataSource;
    this.lengthWithdraw = responseData.data.length;
  }

  async getServerData(event) {
    this.pageIndexWithdraw = event.pageIndex;
    this.pageSizeWithdraw = event.pageSize;
    this.initUserByApp();
  }

}


@Component({
  selector: 'deuser-more-dialog',
  templateUrl: 'detail-user.html',
})

export class DeActiveUserMoreDialog implements OnInit {
  form: FormGroup;
  userId: string;
  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<DeActiveUserMoreDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User, private userService: UserService) {
  }

  async ngOnInit() {
    this.userId = this.data._id;
    this.form = this.formBuilder.group({
      name: [''],
      mobileNo: [''],
      referCode: [''],
      reference: [''],
      uniqueId: [''],
      coin: 0,
      amount: 0,
      totalcoin: 0,
      isActive: 0,
      isFirstWithdraw: 0,
      getreferCoin: 0,
      totalimpression: 0,
      totalclick: 0,
      successimpression: 0,
      failimpression: 0,
      successclick: 0,
      failclick: 0,
      scratchcount: 0,
      spincount: 0,
      gamecount: 0,
      coinimpression: 0,
      coinclick: 0,
      coinscratch: 0,
      coinspin: 0,
      coinreference: 0,
      coinplaygame: 0
    })
    setTimeout(() => {
      this.initUserDetails(); 
    }, 100);
  }
  async initUserDetails() {
    var responseData = await this.userService.getUserDetails(this.userId);
    console.log(responseData.data)
    
    if (responseData.code == 1) {
      this.data = responseData.data;
      this.form.setValue({
        name: this.data.name,
        mobileNo: this.data.mobileNo,
        referCode: this.data.referCode,
        reference: this.data.reference,
        uniqueId: this.data.uniqueId,
        coin: this.data.coin,
        amount: this.data.amount,
        totalcoin: this.data.totalcoin,
        isActive: this.data.isActive,
        isFirstWithdraw: this.data.isFirstWithdraw,
        getreferCoin: this.data.getreferCoin,
        totalimpression: this.data.totalimpression,
        totalclick: this.data.totalclick,
        successimpression: this.data.successimpression,
        failimpression: this.data.failimpression, 
        successclick: this.data.successclick,
        failclick:this.data.failclick, 
        scratchcount:  this.data.scratchcount,
        spincount: this.data.spincount,
        gamecount: this.data.gamecount,
        coinimpression:  this.data.coinimpression,
        coinclick:  this.data.coinclick,
        coinscratch:  this.data.coinscratch,
        coinspin: this.data.coinspin,
        coinreference: this.data.coinreference,
        coinplaygame: this.data.coinplaygame,
      })
    } else {
      this.form.reset();
    }
  }




}