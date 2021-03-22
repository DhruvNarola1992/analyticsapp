import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ReportService } from 'src/api/report/report.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export interface UserReportData {
"_id" : string;

"totalimpression" : number;
"successimpression" : number;
"failimpression" : number;
"coinimpression" : number;

"totalclick" : number;
"successclick" : number;
"failclick" : number;
"coinclick" : number;

"scratchcount" : number;
"coinscratch" : number;

"spincount" : number;
"coinspin" : number;

"gamecount" : number;
"coinplaygame" : number;

"coinreference" : number;

"withdrawcoin" : number;
"withdrawamount" : number;

"todayassigntask" : number;
"todayassignclick" : number;

"todayregister" : number;
"todaylogin" : number;
}

export interface App {
  uan: string;
}

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss']
})

export class InputsComponent implements OnInit {
  myControl = new FormControl();
  options: App[];
  filteredOptions: Observable<App[]>;

  dataSource;
  displayedColumns: string[] = ['index', 'date' , 'earn' , 'todayassigntask' , 'todayassignclick']; // ,'imp', 'click', 'scratch', 'spin', 'game', 'reference', 'withdraw', 'task', 'active'];
  //pagination 
  pageIndex: number;
  pageSize: number;
  length: number;
  //type --fix
  type: string;
  subtype: string;
  uan: string;


  constructor(public reportService: ReportService, public matDialog: MatDialog) { }

  async ngOnInit() {
    var responseData = await this.reportService.getApplication();
    if(responseData.code == 1) {
      this.options = responseData.data;
      this.myControl.setValue(responseData.data[0]);
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith<string | App>(''),
        map(value => (typeof value === 'string' ? value : value.uan)),
        map(uan => (uan ? this._filter(uan) : this.options.slice()))
      );
    }
    this.pageIndex = 0;
    this.pageSize = 10;
    this.type = "app";
    this.subtype = "day";
    this.uan = this.options[0].uan;
    this.initReportApplication();
  }

  displayFn(user?: App): string | undefined {
    return user ? user.uan : undefined;
  }

  private _filter(name: string): App[] {
    const filterValue = name;
    return this.options.filter(option => option.uan.indexOf(filterValue) === 0);
    // return this.options.filter(o => o.uan.includes(filterValue));
  }

  changeApplication(event){
     console.log(event.uan)
     this.uan = event.uan;
     this.initReportApplication();
  }


 
  async initReportApplication() {
    //Server data -- get total length
    var requestData = {
      "pageIndex": this.pageIndex,
      "pageSize": this.pageSize,
      "type": this.type,
      "subtype": this.subtype,
      "uan": this.uan
    }
    console.log(requestData)
    var responseData = await this.reportService.getReport(requestData);
    this.dataSource = responseData.data.dataSource;
    this.length = responseData.data.length;
  }

  getServerData(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.initReportApplication();
  }

}

