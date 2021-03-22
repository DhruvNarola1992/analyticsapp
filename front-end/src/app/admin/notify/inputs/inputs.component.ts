import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotifyService } from 'src/api/notify/notify.service';

export interface NotificationData {
  "_id" : string,
  "updateDate" : string,
  "createDate" : string,
  "title" : string,
  "text" : string,
  "image" : string
}

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss']
})

export class InputsComponent implements OnInit {
  rowData:NotificationData;
  displayedColumns = ["index","title","text", "createdate" , "actions"];
  dataSource;

  constructor(public notifyService: NotifyService, public matDialog: MatDialog) { }


  ngOnInit() {
   this.initNotify();  
  }

  async initNotify(){
    var responseData = await this.notifyService.getAllNotification();
    this.dataSource = responseData.data;
  }

  async showNotify(show,index) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(EditNotifyDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id" : this.rowData._id,
        "updateDate" : this.rowData.updateDate,
        "createDate" : this.rowData.createDate,
        "title" : this.rowData.title,
        "text" : this.rowData.text,
        "image" : this.rowData.image
      }
    });

    dialogRef.afterClosed().pipe().subscribe(result => {
      this.initNotify();
    });
  }

  async deleteNotify(show,index) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(DeleteNotifyDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id" : this.rowData._id,
        "updateDate" : this.rowData.updateDate,
        "createDate" : this.rowData.createDate,
        "title" : this.rowData.title,
        "text" : this.rowData.text,
        "image" : this.rowData.image
      }
    });

    dialogRef.afterClosed().pipe().subscribe(result => {
      this.initNotify();
    });
  }
  

}

@Component({
  selector: 'notify-edit-dialog',
  templateUrl: 'edit-notify.html',
})

export class EditNotifyDialog implements OnInit {
  form: FormGroup;

  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<EditNotifyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NotificationData, private notifyService: NotifyService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: this.data._id,
      updateDate: this.data.updateDate,
      createDate: this.data.createDate,
      title : this.data.title,
      text : this.data.text,
      image : this.data.image
    })
  }

  async updateNotify(form) {
    var data = await this.notifyService.updateNotification(form.value);
    if (data.code == 1) {
      this.dialogRef.close(data.data);
    } else {

    }
  }

}

@Component({
  selector: 'notify-delete-dialog',
  templateUrl: 'delete-notiy.html',
})

export class DeleteNotifyDialog implements OnInit {
  form: FormGroup;

  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<DeleteNotifyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NotificationData, private notifyService: NotifyService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: this.data._id,
      updateDate: {value:this.data.updateDate,disabled: true},
      createDate: {value:this.data.createDate,disabled: true},
      title :     {value:this.data.title,disabled: true},
      text :      {value:this.data.text,disabled: true},
      image :     {value:this.data.image,disabled: true}
    })
  }

  async deleteNotify(form) {
    var data = await this.notifyService.deleteNotification(form.value.id);
    if (data.code == 1) {
      this.dialogRef.close(data.data);
    } else {

    }
  }
}

