import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import * as moment from 'moment';
import {ErrorStateMatcher} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { BulkService } from 'src/api/bulk/bulk.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  
  fromdate = new FormControl(moment(new Date()).startOf('month').format());  

  constructor(public bulkService: BulkService, public matDialog: MatDialog) { }

  ngOnInit() {
   
  }

  async viewData(){
    var deletedate = moment(this.fromdate.value).endOf('day').format();
    var requestData = {
      "fromdate": deletedate
    }
    // console.log(requestData)
    var responseData = await this.bulkService.deleteActivity(requestData);
    if(responseData.code == 1) {
      debugger
    } else {

    }
   
  }


}
