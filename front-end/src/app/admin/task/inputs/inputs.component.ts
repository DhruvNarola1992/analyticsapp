import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TaskService } from 'src/api/task/task.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface TaskData {
  "_id": string;
  "isClick": boolean;
  "isActive": boolean;
  "updateDate": string;
  "createDate": string;
  "task": string;
  "spin": number;
  "maxclick": number;
  "maxtimeclick": number;
  "mintimeclick": number;
  "clicktimer": number;
}

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss']
})

export class InputsComponent implements OnInit {
  dataSource;
  rowData: TaskData;
  displayedColumns: string[] = ['index', 'task', 'spin', 'isClick', 'createDate', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public taskService: TaskService, public matDialog: MatDialog) { }


  ngOnInit() {
    this.initTask();
  }

  async initTask() {
    var responseData = await this.taskService.getAllTask();
    this.dataSource = new MatTableDataSource(responseData.data);
  }

  async showTask(show,index) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(EditTaskDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id": this.rowData._id,
        "isClick": this.rowData.isClick,
        "isActive": this.rowData.isActive,
        "updateDate": this.rowData.updateDate,
        "createDate": this.rowData.createDate,
        "task": this.rowData.task,
        "spin": this.rowData.spin,
        "maxclick": this.rowData.maxclick,
        "maxtimeclick": this.rowData.maxtimeclick,
        "mintimeclick": this.rowData.mintimeclick,
        "clicktimer": this.rowData.clicktimer
      }
    });

    dialogRef.afterClosed().pipe().subscribe(result => {
      this.initTask();
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
        "isClick": this.rowData.isClick,
        "isActive": this.rowData.isActive,
        "updateDate": this.rowData.updateDate,
        "createDate": this.rowData.createDate,
        "task": this.rowData.task,
        "spin": this.rowData.spin,
        "maxclick": this.rowData.maxclick,
        "maxtimeclick": this.rowData.maxtimeclick,
        "mintimeclick": this.rowData.mintimeclick,
        "clicktimer": this.rowData.clicktimer
      }
    });

    dialogRef.afterClosed().pipe().subscribe(result => {
      this.initTask();
    });
  }


}


@Component({
  selector: 'task-edit-dialog',
  templateUrl: 'edit-task.html',
})

export class EditTaskDialog implements OnInit {
  form: FormGroup;

  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<EditTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TaskData, private taskService: TaskService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: this.data._id,
      isClick: this.data.isClick,
      isActive: this.data.isActive,
      updateDate: this.data.updateDate,
      createDate: this.data.createDate,
      task: this.data.task,
      spin: this.data.spin,
      maxclick: this.data.maxclick,
      maxtimeclick: this.data.maxtimeclick,
      mintimeclick: this.data.mintimeclick,
      clicktimer: this.data.clicktimer
    })
  }

  async updateTask(form) {
    var data = await this.taskService.updateTask(form.value);
    if (data.code == 1) {
      this.dialogRef.close(data.data);
    } else {

    }
  }

  onChange(event) {
    this.form.patchValue({
      isClick: event.checked
    })
  }
}


@Component({
  selector: 'task-delete-dialog',
  templateUrl: 'delete-task.html',
})

export class DeleteTaskDialog implements OnInit {
  form: FormGroup;

  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<DeleteTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TaskData, private taskService: TaskService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: this.data._id,
      isClick: {value:this.data.isClick,disabled: true},
      isActive: {value:this.data.isActive,disabled: true},
      updateDate:{value: this.data.updateDate,disabled: true},
      createDate: {value:this.data.createDate,disabled: true},
      task: {value: this.data.task, disabled: true},
      spin: {value: this.data.spin,disabled: true},
      maxclick: {value:this.data.maxclick,disabled: true},
      maxtimeclick: {value:this.data.maxtimeclick,disabled: true},
      mintimeclick: {value:this.data.mintimeclick,disabled: true},
      clicktimer: {value:this.data.clicktimer,disabled: true}
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

