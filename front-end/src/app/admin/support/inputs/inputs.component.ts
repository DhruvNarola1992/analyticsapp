import { Component, OnInit, Inject, ViewChild, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QueryService } from 'src/api/query/query.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PaymentService } from 'src/api/withdraw/withdraw.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

export interface Query {
  "_id" : string;
  "answer" ?: string;
  "updateDate" ?: string;
  "createDate" ?: string;
  "query" ?: string;
  "userId" ?: string;
  "mobileNo" ?: string;
  "deviceId" ?: string;
  "uniqueId" ?: string;
  "email" ?: string;
  "subject" ?: string;
  "text" ?: string;
}

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss']
})

export class InputsComponent implements OnInit {
  dataSource;
  displayedColumns: string[] = ['index', 'mobileNo', 'query', 'createDate', 'time', 'actions'];
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

  rowData: Query;

  constructor(public queryService: QueryService, public matDialog: MatDialog) { }

  ngOnInit() {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.filterMobilno = "";
    this.active = "createDate";
    this.direction = "desc";
    this.type = "Not";
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
      "type": this.type
    }
    // console.log(requestData)
    var responseData = await this.queryService.getAllQuestion(requestData);
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

  async supportDelete(show,index) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(DeleteSupportDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData._id
      }
    });

    dialogRef.afterClosed().pipe().subscribe(result => {
      this.initUser();
    });
  }

  async supportEdit(show,index) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(EditSupportDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData._id,
        "answer":this.rowData.answer,
        "updateDate":this.rowData.updateDate,
        "createDate":this.rowData.createDate,
        "query":this.rowData.query,
        "userId":this.rowData.userId,
        "mobileNo":this.rowData.mobileNo,
        "deviceId":this.rowData.deviceId,
        "uniqueId":this.rowData.uniqueId,
        "email":this.rowData.email,
        "subject":this.rowData.subject,
        "text":this.rowData.text
      }
    });

    dialogRef.afterClosed().pipe().subscribe(result => {
      this.initUser();
    });
  }
}


@Component({
  selector: 'support-delete-dialog',
  templateUrl: 'delete-support.html',
})

export class DeleteSupportDialog implements OnInit {
  form: FormGroup;
  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<DeleteSupportDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Query, private queryService: QueryService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: this.data._id,
    })
  }

  async deleteSupport(form) {
    var data = await this.queryService.deleteQuestion(form.value.id);
    if (data.code == 1) {
      this.dialogRef.close(data);
    } else {

    }
  }
}

@Component({
  selector: 'support-edit-dialog',
  templateUrl: 'edit-support.html',
})

export class EditSupportDialog implements OnInit {
  form: FormGroup;
  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<EditSupportDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Query, private queryService: QueryService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      "_id": this.data._id,
      "answer":this.data.answer,
      "updateDate":this.data.updateDate,
      "createDate":this.data.createDate,
      "query":this.data.query,
      "userId":this.data.userId,
      "mobileNo":this.data.mobileNo,
      "deviceId":this.data.deviceId,
      "uniqueId":this.data.uniqueId,
      "email":this.data.email,
      "subject":this.data.subject,
      "text":this.data.text
    })
  }

  async editSupport(form) {
    
    var data = await this.queryService.updateQuestion(form.value._id, form.value);
    if (data.code == 1) {
      this.dialogRef.close(data);
    } else {

    }
  }
}