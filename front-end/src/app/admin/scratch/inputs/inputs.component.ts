import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ScratchService } from 'src/api/scratch/scratch.service';

export interface ScratchData {
    "_id" : string;
    "selectcoin" : string;
    "totalCard" : number;
    "scratchimage" : string;
}

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss']
})

export class InputsComponent implements OnInit {
  rowData: ScratchData;
  dataSource;
  displayedColumns: string[] = ['index', 'scratchimage', 'selectcoin', 'totalCard', 'actions'];

  constructor(public scratchService: ScratchService, public matDialog: MatDialog) { }


  ngOnInit() {
    this.initScratch();  
  }

  async initScratch(){
    var responseData = await this.scratchService.getAllScratch();
    this.dataSource = responseData.data; 
  }

  async showScratch(show,index) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(EditScratchDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id" : this.rowData._id,
        "selectcoin" : this.rowData.selectcoin,
        "totalCard" : this.rowData.totalCard,
        "scratchimage" : this.rowData.scratchimage,
      }
    });

    dialogRef.afterClosed().pipe().subscribe(result => {
      this.initScratch();
    });
  }

  deleteScratch(show,index) {
    this.rowData = show;
    const dialogRef = this.matDialog.open(DeleteScratchDialog, {
      height: 'auto',
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      data: {
        "_id" : this.rowData._id,
        "selectcoin" : this.rowData.selectcoin,
        "totalCard" : this.rowData.totalCard,
        "scratchimage" : this.rowData.scratchimage,
      }
    });

    dialogRef.afterClosed().pipe().subscribe(result => {
      this.initScratch();
    });
  }

}

@Component({
  selector: 'scratch-edit-dialog',
  templateUrl: 'edit-scratch.html',
})

export class EditScratchDialog implements OnInit {
  form: FormGroup;
  @ViewChild('fileUploader') fileUploader:ElementRef;
  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<EditScratchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ScratchData, private scratchService: ScratchService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      "id": this.data._id,
      "selectcoin": this.data.selectcoin,
      "totalCard": this.data.totalCard,
      "scratchpic": this.data.scratchimage,
      "pre_scratchimage": this.data.scratchimage,
      "pre_totalCard": this.data.totalCard,
      "pre_selectcoin": this.data.selectcoin
    })
  }

  async updateScratch(form) {
    var formData: any = new FormData();
    formData.append("totalCard", this.form.get('totalCard').value);
    formData.append("coin", this.form.get('selectcoin').value);
    formData.append("scratchpic", this.form.get('scratchpic').value);
    formData.append("pasttotalCard", this.form.get('pre_totalCard').value);
    formData.append("pastcoin", this.form.get('pre_selectcoin').value);
    formData.append("pastscratchpic", this.form.get('pre_scratchimage').value);
    var data = await this.scratchService.updateScratch(formData);
    if(data.code == 1) {
      this.dialogRef.close();
    } else {

    }
  }

  async clearForm(){
    this.form.patchValue({
      totalCard: '',
      selectcoin: '',
      scratchpic: [null]
    });
    this.fileUploader.nativeElement.value = null;
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      scratchpic: file
    });
    this.form.get('scratchpic').updateValueAndValidity()
  }
  
}


@Component({
  selector: 'scratch-delete-dialog',
  templateUrl: 'delete-scratch.html',
})

export class DeleteScratchDialog implements OnInit {
  form: FormGroup;

  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<DeleteScratchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ScratchData, private scratchService: ScratchService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      "id": this.data._id,
      "selectcoin": {"value":this.data.selectcoin,"disabled":true},
      "totalCard":  {"value":this.data.totalCard,"disabled":true},
      "scratchpic": {"value":this.data.scratchimage,"disabled":true},
      "pre_scratchimage": this.data.scratchimage,
      "pre_totalCard": this.data.totalCard,
      "pre_selectcoin": this.data.selectcoin
    })
  }

  async deleteScratch(form) {
     var data = await this.scratchService.deleteScratch(form.value);
    if (data.code == 1) {
      this.dialogRef.close(data.data);
    } else {

    }
  }
}










