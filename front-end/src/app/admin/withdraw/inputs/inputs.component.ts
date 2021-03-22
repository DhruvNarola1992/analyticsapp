import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from 'src/api/withdraw/withdraw.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { UserService } from 'src/api/user/user.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

export interface WithdrawData {
  "_id": string;
  "status": string;
  "updateDate": string;
  "createDate": string;
  "coin": number;
  "amount": number;
  "mobileNo": string;
  "name": string;
  "deviceId": string;
  "uniqueId": string;
  "userId": string;
  "isActive": boolean;
}

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

export interface App{
  _id: string;
}


@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss']
})

export class InputsComponent implements OnInit {
  dataSource;
  displayedColumns: string[] = ['select', 'index', 'mobileNo', 'coin', 'amount', 'name', 'createDate', 'time', 'actions'];
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
  type: string;

  selection: SelectionModel<WithdrawData>;

  rowData: WithdrawData;



  constructor(public paymentService: PaymentService, public matDialog: MatDialog) { }

  ngOnInit() {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.filterMobilno = "";
    this.active = "createDate";
    this.direction = "desc";
    this.type = "pending";
    this.initWithdraw();

  }

  async initWithdraw() {
    //Server data -- get total length
    var requestData = {
      "pageIndex": this.pageIndex,
      "pageSize": this.pageSize,
      "filterMobilno": this.filterMobilno,
      "active": this.active,
      "direction": this.direction,
      "type": this.type
    }
    // console.log(requestData)
    var responseData = await this.paymentService.getAllWithdraw(requestData);
    this.dataSource = responseData.data.dataSource;
    this.length = responseData.data.length;
    this.selection = new SelectionModel<WithdrawData>(true, []);
  }

  getServerData(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.initWithdraw();
  }

  sortWithdraw(event) {
    this.active = event.active;
    this.direction = event.direction;
    if (event.direction == "") {
      this.direction = "asc";
    }
    this.initWithdraw();
  }

  applyFilter(filterValue: string) {
    this.filterMobilno = filterValue.trim();
    this.initWithdraw();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach(row => this.selection.select(row));
  }

  async userActive(show,index) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(EditUserDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData._id,
        "status": this.rowData.status,
        "updateDate": this.rowData.updateDate,
        "createDate": this.rowData.createDate,
        "coin": this.rowData.coin,
        "amount": this.rowData.amount,
        "mobileNo": this.rowData.mobileNo,
        "name": this.rowData.name,
        "deviceId": this.rowData.deviceId,
        "uniqueId": this.rowData.uniqueId,
        "userId": this.rowData.userId,
        "isActive": this.rowData.isActive
      }
    });

    dialogRef.afterClosed().pipe().subscribe(result => {
      this.initWithdraw();
    });
  }

  async userPayment(show) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(HistoryWithdrawDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData._id,
        "status": this.rowData.status,
        "updateDate": this.rowData.updateDate,
        "createDate": this.rowData.createDate,
        "coin": this.rowData.coin,
        "amount": this.rowData.amount,
        "mobileNo": this.rowData.mobileNo,
        "name": this.rowData.name,
        "deviceId": this.rowData.deviceId,
        "uniqueId": this.rowData.uniqueId,
        "userId": this.rowData.userId,
        "isActive": this.rowData.isActive
      }
    });
  }

  async userActivity(show) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(UserActivityHistoryDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData._id,
        "status": this.rowData.status,
        "updateDate": this.rowData.updateDate,
        "createDate": this.rowData.createDate,
        "coin": this.rowData.coin,
        "amount": this.rowData.amount,
        "mobileNo": this.rowData.mobileNo,
        "name": this.rowData.name,
        "deviceId": this.rowData.deviceId,
        "uniqueId": this.rowData.uniqueId,
        "userId": this.rowData.userId,
        "isActive": this.rowData.isActive
      }
    });
  }

  async userBulkDeactive(){
    if(this.selection.selected.length > 0) {
      let arrayIds = new Set();  
      for (let index = 0; index < this.selection.selected.length; index++) {
        const mobileNo = this.selection.selected[index].mobileNo;
        arrayIds.add(mobileNo);
      }
      
      const dialogRef = this.matDialog.open(EditBulkUserDialog, {
        height: 'auto',
        width: 'auto',
        disableClose: true,
        hasBackdrop: true,
        data: {
          "mobileNos": Array.from(arrayIds),
          "isActive": false,
          "status": "PENDING"
        }
      });
      dialogRef.afterClosed().pipe().subscribe(result => {
        this.initWithdraw();
      });
    }
  }

  async userBulkWithdraw(){
    if(this.selection.selected.length == 0) {
      const dialogRef = this.matDialog.open(BulkWithrawDialog, {
        height: 'auto',
        width: 'auto',
        disableClose: true,
        hasBackdrop: true,
        data: {
          "status": "pending"
        }
      });
      dialogRef.afterClosed().pipe().subscribe(result => {
        this.initWithdraw();
      });
    }
  }

  async downloadBulkWithdraw(){
    if(this.selection.selected.length == 0) {
      var responseData = await this.paymentService.downloadBulkWithdraw();
      var res = responseData.substring(2, 6);
      if(res !== "code") {
        const a = document.createElement('a');
        document.body.appendChild(a);
        const blob = new Blob([responseData], { type: 'text/csv' });
        const url= window.URL.createObjectURL(blob);
        a.href = url;
        a.download = new Date().toDateString()+".csv"; // you need to write the extension of file here
        a.click();
        window.URL.revokeObjectURL(url);
      }
    }
  }

  async userActivityByApps(show) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(WithUserActivityByAppsHistoryDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData.userId
      }
    });
  }

  async userScratch(show) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(WithUserDailyScratchHistoryDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData.userId
      }
    });
  }

  async userTaskSpin(show) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(WithUserDailyTaskSpinDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData.userId
      }
    });
  }

  async userApplication(show) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(WithUserApplicationDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData.userId
      }
    });
  }

  async userMoredetail(show) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(WithUserMoreDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData.userId
      }
    });
  }

}


@Component({
  selector: 'user-edit-dialog',
  templateUrl: 'edit-user.html',
})

export class EditUserDialog implements OnInit {
  form: FormGroup;

  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<EditUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: WithdrawData, private paymentService: PaymentService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      "_id": this.data._id,
      "status": this.data.status,
      "updateDate": this.data.updateDate,
      "createDate": this.data.createDate,
      "coin": this.data.coin,
      "amount": this.data.amount,
      "mobileNo": this.data.mobileNo,
      "name": this.data.name,
      "deviceId": this.data.deviceId,
      "uniqueId": this.data.uniqueId,
      "userId": this.data.userId,
      "isActive": this.data.isActive
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
  selector: 'user-withdraw-history-dialog',
  templateUrl: 'history-payment.html',
})

export class HistoryWithdrawDialog implements OnInit {
  dataSource;
  displayedColumns: string[] = [ 'index', 'coin', 'amount', 'status','createDate', 'time'];
  //pagination 
  pageIndexWithdraw: number;
  pageSizeWithdraw: number;
  lengthWithdraw: number;
  //Find Withdraw Activity
  mobileNo: string;

  constructor(public dialogRef: MatDialogRef<HistoryWithdrawDialog>,
    @Inject(MAT_DIALOG_DATA) public data: WithdrawData, private paymentService: PaymentService) {
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
  selector: 'user-activity-history-dialog',
  templateUrl: 'activity-user.html',
})

export class UserActivityHistoryDialog implements OnInit {
  dataSource;
  displayedColumns: string[] = [ 'index','uan','type', 'coin', 'flag', 'createDate', 'time'];
  //pagination 
  pageIndexWithdraw: number;
  pageSizeWithdraw: number;
  lengthWithdraw: number;
  //Find Withdraw Activity
  userId: string;

  constructor(public dialogRef: MatDialogRef<UserActivityHistoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: WithdrawData, private paymentService: PaymentService) {
  }

  ngOnInit() {
    this.pageIndexWithdraw = 0;
    this.pageSizeWithdraw = 10;
    this.userId = this.data.userId;
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
  selector: 'user-editbulk-dialog',
  templateUrl: 'editbulk-user.html',
})

export class EditBulkUserDialog implements OnInit {
  form: FormGroup;
  mobileNos = [];
  status : string;
  
  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<EditBulkUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private paymentService: PaymentService) {
  }

  ngOnInit() {
    this.mobileNos = this.data.mobileNos;
    this.status = this.data.status;
    this.form = this.formBuilder.group({
      "isActive": this.data.isActive
    })
  }

  async updateBulkUser(form) {
    var requestData = {
      mobileNos: this.mobileNos,
      status: this.status,
      isActive: this.form.get('isActive').value
    }
    var data = await this.paymentService.updateBulkUser(requestData);
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
  selector: 'success-bulk-withdraw-dialog',
  templateUrl: 'success-user-withdraw.html',
})

export class BulkWithrawDialog implements OnInit {
  form: FormGroup;
  status: string;
  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<BulkWithrawDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private paymentService: PaymentService) {
  }

  ngOnInit() {
    this.status = this.data.status;
    this.form = this.formBuilder.group({
      
    })
  }

  async updateBulkWithdrawUser(form) {
    var data = await this.paymentService.updateBulkWithdrawUser(this.status);
    if (data.code == 1) {
      this.dialogRef.close(data.data);
    } else {

    }
  }
}


@Component({
  selector: 'with-user-activity-apps-history-dialog',
  templateUrl: 'activity-user-app.html',
})

export class WithUserActivityByAppsHistoryDialog implements OnInit {
  myControl = new FormControl();
  options: App[];
  filteredOptions: Observable<App[]>;
  
  dataSource;
  displayedColumns: string[] = ['index', 'uan', 'type', 'coin', 'flag', 'createDate', 'time'];
  //pagination 
  pageIndexWithdraw: number;
  pageSizeWithdraw: number;
  lengthWithdraw: number;
  //Find Withdraw Activity
  userId: string;
  uan: string;

  constructor(public dialogRef: MatDialogRef<WithUserActivityByAppsHistoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User,  private userService:UserService) {
  }

 async ngOnInit() {
    this.userId = this.data._id;
    var responseData = await this.userService.getUserByApplicationActivity(this.userId);
    if(responseData.code == 1) {
      this.options = responseData.data;
      this.myControl.setValue(responseData.data[0]);
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith<string | App>(''),
        map(value => (typeof value === 'string' ? value : value._id)),
        map(_id => (_id ? this._filter(_id) : this.options.slice()))
      );
    }
    
    this.pageIndexWithdraw = 0;
    this.pageSizeWithdraw = 10;
    this.uan = this.options[0]._id;
    this.initWithdrawHistory();
  }

  displayFn(user?: App): string | undefined {
    return user ? user._id : undefined;
  }

  private _filter(name: string): App[] {
    const filterValue = name;

    return this.options.filter(option => option._id.indexOf(filterValue) === 0);
    // return this.options.filter(o => o.uan.includes(filterValue));
  }

  changeApplication(event){
     console.log(event)
     this.uan = event._id;
     this.initWithdrawHistory();
  }

  async initWithdrawHistory() {
    //Server data -- get total length
    var requestData = {
      "pageIndex": this.pageIndexWithdraw,
      "pageSize": this.pageSizeWithdraw,
      "userId": this.userId,
      "uan": this.uan
    }
    // console.log(requestData)
    var responseData = await this.userService.getUserActivityByApps(requestData);
    console.log(responseData.data.dataSource, responseData.data.length[0].count)
    this.dataSource = responseData.data.dataSource;
    this.lengthWithdraw = responseData.data.length[0].count;
  }

  async getServerData(event) {
    this.pageIndexWithdraw = event.pageIndex;
    this.pageSizeWithdraw = event.pageSize;
    this.initWithdrawHistory();
  }

}

@Component({
  selector: 'with-user-daily-scratch-dialog',
  templateUrl: 'daily-scratch.html',
})

export class WithUserDailyScratchHistoryDialog implements OnInit {
  dataSource;
  displayedColumns: string[] = ['index', 'uan', 'scratchimage', 'totalCard', 'currentCard'];
  //pagination 
  pageIndexWithdraw: number;
  pageSizeWithdraw: number;
  lengthWithdraw: number;
  //Find Withdraw Activity
  userId: string;

  constructor(public dialogRef: MatDialogRef<WithUserDailyScratchHistoryDialog>,
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
  selector: 'with-user-daily-task-dialog',
  templateUrl: 'daily-task.html',
})

export class WithUserDailyTaskSpinDialog implements OnInit {
  dataSource;
  displayedColumns: string[] = ['index', 'uan', 'task', 'currenttask', 'spin', 'currentspin'];
  //pagination 
  pageIndexWithdraw: number;
  pageSizeWithdraw: number;
  lengthWithdraw: number;
  //Find Withdraw Activity
  userId: string;

  constructor(public dialogRef: MatDialogRef<WithUserDailyTaskSpinDialog>,
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
  selector: 'with-user-application-dialog',
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

export class WithUserApplicationDialog implements OnInit {
  dataSource;
  displayedColumns: string[] = ['icon', 'uan', 'coin', 'totalcoin'];
  //pagination 
  pageIndexWithdraw: number;
  pageSizeWithdraw: number;
  lengthWithdraw: number;
  //Find Withdraw Activity
  userId: string;
  expandedElement: any | null;
  constructor(public dialogRef: MatDialogRef<WithUserApplicationDialog>,
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
  selector: 'with-user-more-dialog',
  templateUrl: 'detail-user.html',

})

export class WithUserMoreDialog implements OnInit {
  form: FormGroup;
  userId: string;
  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<WithUserMoreDialog>,
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

  async updateUserDetails() {
    var responseData = await this.userService.updateUserDetails(this.userId, this.form.value.referCode);
    if (responseData.code == 1) { 
      this.dialogRef.close();
    } else {

    }

  }

}


