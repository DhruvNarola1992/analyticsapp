import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApplicationService } from 'src/api/application/app.service';

export interface ApplicationData {
  "_id": string;
  "isActive": boolean;
  "isActiveClick": boolean;
  "totalassigntask": number;
  "totalassignclick": number;
  "todayassigntask": number;
  "todayassignclick": number;
  "updateDate": string;
  "createDate": string;
  "name": string;
  "icon": string;
  "msg": string;
  "url": string;
  "uan": string;
  "taskclickpercentage": number;
  "isBeta"?: boolean;
}

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss']
})

export class InputsComponent implements OnInit {
  dataSource;
  rowData: ApplicationData;
  displayedColumns: string[] = ['icon', 'name', 'totalassigntask', 'totalassignclick', 'todayassigntask' , 'todayassignclick' ,'currentpercentage' ,'taskclickpercentage', 'createDate', 'actions'];

  constructor(public applicationService: ApplicationService, public matDialog: MatDialog) { }

  ngOnInit() {
    this.initApp();  
  }

  async initApp(){
    var responseData = await this.applicationService.getAllApplication();
    this.dataSource = responseData.data;
  }

  async showApplication(show,index) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(ApplicationDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData._id,
        "isActive": this.rowData.isActive,
        "isActiveClick": this.rowData.isActiveClick,
        "totalassigntask": this.rowData.totalassigntask,
        "totalassignclick": this.rowData.totalassignclick,
        "todayassigntask": this.rowData.todayassigntask,
        "todayassignclick": this.rowData.todayassignclick,
        "updateDate": this.rowData.updateDate,
        "createDate": this.rowData.createDate,
        "name": this.rowData.name,
        "icon": this.rowData.icon,
        "msg": this.rowData.msg,
        "url": this.rowData.url,
        "uan": this.rowData.uan,
        "taskclickpercentage": this.rowData.taskclickpercentage,
        "isBeta": this.rowData.isBeta
      }
    });

    dialogRef.afterClosed().pipe().subscribe(result => {
      this.initApp();
    });
  }
}

@Component({
  selector: 'application-edit-dialog',
  templateUrl: 'application-edit-dialog.html',
})

export class ApplicationDialog implements OnInit {
  form: FormGroup;

  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<ApplicationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationData, private applicationService : ApplicationService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: this.data._id,
      name: this.data.name,
      icon: this.data.icon,
      url: this.data.url,
      msg: this.data.msg,
      taskclickpercentage: this.data.taskclickpercentage,
      isActive: this.data.isActive,
      isBeta: this.data.isBeta
    })
  }

  async submit(form) {
     var data = await this.applicationService.updateApplication(form.value);
     if(data.code == 1) {
      this.dialogRef.close(data.data);
     } else {

     }
  }

  onChange(event) {
    this.form.patchValue({ 
      isActive: event.checked
    })
  }

  onChangeBeta(event) {
    this.form.patchValue({ 
      isBeta: event.checked
    })
  }
}