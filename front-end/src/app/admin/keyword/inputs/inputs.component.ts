import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { KeywordService } from 'src/api/keyword/keyword.service';
import {CdkDragDrop, moveItemInArray,  transferArrayItem, CdkDragHandle} from '@angular/cdk/drag-drop'
import { MatTable } from '@angular/material/table';
export interface ApplicationData {
  "_id": string;
  "update"?: string;
  "keyword": string;
  "value"?: string;
  "desc"?: string;
  "seq"?: number;
  
  
}

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss']
})

export class InputsComponent implements OnInit {
  @ViewChild('table') table: MatTable<ApplicationData>;;
  dataSource;
  rowData: ApplicationData;
  displayedColumns: string[] = ['seq', 'keyword', 'value', 'update' , 'actions'];

  constructor(public applicationService: KeywordService, public matDialog: MatDialog) { }

  ngOnInit() {
    this.initApp();  
  }

  drop(event: CdkDragDrop<ApplicationData[]>) {
    const prevIndex = this.dataSource.findIndex((d) => d == event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    console.log(event.item.dropContainer.data)
    this.table.renderRows();
    let keywords = [];
    for (let index = 0; index < event.item.dropContainer.data.length; index++) {
      const element = event.item.dropContainer.data[index];
      var rId = element._id;
     
      var objectData = {
        _id: rId,
        newseq: index + 1
      }
      keywords.push(objectData);
    }
    this.setDragData(keywords);
    
  }

  async setDragData(keywords) {
    var data = {
      keywords: keywords
    }
    await this.applicationService.updateSequence(data);
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
        "update": this.rowData.update,
        "keyword": this.rowData.keyword,
        "value": this.rowData.value,
        "desc": this.rowData.desc,
        "seq": this.rowData.seq,
      }
    });

    dialogRef.afterClosed().pipe().subscribe(result => {
      this.initApp();
    });
  }

  async deleteTask(show,index) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(DeleteTaskDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData._id,
        "update": this.rowData.update,
        "keyword": this.rowData.keyword,
        "value": this.rowData.value,
        "desc": this.rowData.desc,
        "seq": this.rowData.seq,
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
    @Inject(MAT_DIALOG_DATA) public data: ApplicationData, private applicationService : KeywordService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      "id": this.data._id,
      "update": this.data.update,
      "keyword": this.data.keyword,
      "value": this.data.value,
      "desc": this.data.desc,
      "seq": this.data.seq,
    })
  }

  async submit(form) {
     var data = await this.applicationService.updateApplication(form.value.id,form.value);
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


@Component({
  selector: 'keyword-delete-dialog',
  templateUrl: 'delete-keyword.html',
})

export class DeleteTaskDialog implements OnInit {
  form: FormGroup;

  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<DeleteTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationData, private taskService: KeywordService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: this.data._id,
      keyword: {value:this.data.keyword,disabled: true},
      value: {value:this.data.value,disabled: true},
      seq:{value: this.data.seq,disabled: true},
      desc: {value:this.data.desc,disabled: true},
      update: {value: this.data.update, disabled: true},
    })
  }

  async deleteTask(form) {
    var data = await this.taskService.deleteTask(form.value.id);
    if (data.code == 1) {
      this.dialogRef.close(data.data);
    } else {

    }
  }
}