import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/api/report/report.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export interface UserReportData {
  "_id" ?: string;
  "totalimpression" ?: number; 
  "totalclick" ?: number;
  "successimpression" ?: number;
  "failimpression" ?: number;
  "successclick" ?: number;
  "failclick" ?: number;
  "scratchcount" ?: number;
  "spincount" ?: number;
  "gamecount" ?: number;
  "coinimpression" ?: number;
  "coinclick" ?: number;
  "coinscratch" ?: number;
  "coinspin" ?: number;
  "coinplaygame" ?: number;
  "todayassigntask" ?: number;
  "todayassignclick" ?: number;
  "appId" ?: string;
  "uan" ?: string;
  "name" ?: string;
  }
  
  export interface App {
    uan: string;
  }

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  myControl = new FormControl();
  options: App[];
  filteredOptions: Observable<App[]>;
  uan : string;
  report?: UserReportData;
  constructor(public reportService: ReportService) {}
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
      "pageIndex": 0,
      "pageSize": 0,
      "type": "app",
      "subtype": "",
      "uan": this.uan
     }
     var responseData = await this.reportService.getReport(requestData);
     this.report = responseData.data.dataSource[0];
  }


}
