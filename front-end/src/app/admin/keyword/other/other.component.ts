import { Component, OnInit } from '@angular/core';
import { KeywordService } from 'src/api/keyword/keyword.service';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {


  seq: number;
  keyword:string;
  value:string;
  desc: string;

  constructor(private keywordService:KeywordService) {}

  ngOnInit() {
   this.clearData();
  }

  async onNewKeyword(){
    var requestBody = {
      seq:this.seq,
      keyword:this.keyword,
      value:this.value,
      desc:this.desc
    }
    var responseData = await this.keywordService.addApplication(requestBody);
    if (responseData.code == 1) {
     this.clearData();
    } else {
      
    }
  }

  clearData(){
    this.seq  = 0;
    this.keyword = "";
    this.value = "";
    this.desc = "";
  }

}
