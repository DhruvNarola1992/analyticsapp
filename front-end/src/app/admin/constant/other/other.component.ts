import { Component, OnInit } from '@angular/core';
import { ConstService } from 'src/api/constant/constant.url';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {

  path: string;
  coin: number;
  amount: number;
  bcoin: number;
  ccoin: number;
  rcoin: number;
  consttaskday: number;
  primaryid: string;
  topicname: string;
  minwithcoin: number;
  withdrawarray: string;
  emailaddress: string;
  emailpassword: string;

  constructor(private constService: ConstService) { }

  async ngOnInit() {
    var responseData = await this.constService.sendGetConstant(); //.then(responseData => console.log(responseData));
    if (responseData.code == 1) {
      this.path = responseData.data.path;
      this.coin = responseData.data.coin;
      this.amount = responseData.data.amount;
      this.bcoin = responseData.data.bcoin;
      this.ccoin = responseData.data.ccoin;
      this.rcoin = responseData.data.rcoin;
      this.consttaskday = responseData.data.consttaskday;
      this.primaryid = responseData.data._id;
      this.topicname = responseData.data.topicname;
      this.minwithcoin = responseData.data.minwithcoin;
      this.withdrawarray = responseData.data.withdrawarray;
      this.emailaddress = responseData.data.emailaddress;
      this.emailpassword = responseData.data.emailpassword;
    } else {
      this.path = "";
      this.coin = 0;
      this.amount = 0;
      this.bcoin = 0;
      this.ccoin = 0;
      this.rcoin = 0;
      this.consttaskday = 0;
      this.topicname = "";
      this.minwithcoin = 0;
      this.withdrawarray = "";
      this.emailaddress = "";
      this.emailpassword = "";
    }
  }

  async onUpdate() {
    var requestBody = {
      path: this.path,
      coin: this.coin,
      amount: this.amount,
      bcoin: this.bcoin,
      ccoin: this.ccoin,
      rcoin: this.rcoin,
      consttaskday: this.consttaskday,
      topicname: this.topicname,
      minwithcoin: this.minwithcoin,
      withdrawarray: this.withdrawarray,
      emailaddress: this.emailaddress,
      emailpassword: this.emailpassword
    }

    var responseData = await this.constService.updateConstant(this.primaryid, requestBody);
    if (responseData.code == 1) {
      this.path = responseData.data.path;
      this.coin = responseData.data.coin;
      this.amount = responseData.data.amount;
      this.bcoin = responseData.data.bcoin;
      this.ccoin = responseData.data.ccoin;
      this.rcoin = responseData.data.rcoin;
      this.consttaskday = responseData.data.consttaskday;
      this.primaryid = responseData.data._id;
      this.topicname = responseData.data.topicname;
      this.minwithcoin = responseData.data.minwithcoin;
      this.withdrawarray = responseData.data.withdrawarray;
    } else {
      this.path = "";
      this.coin = 0;
      this.amount = 0;
      this.bcoin = 0;
      this.ccoin = 0;
      this.rcoin = 0;
      this.consttaskday = 0;
      this.topicname = "";
      this.minwithcoin = 0;
      this.withdrawarray = "";
      this.emailaddress = "";
      this.emailpassword = "";
    }
  }

  getErrorMessage() {
    // return this.email.hasError('required')
    //   ? 'You must enter a value'
    //   : this.email.hasError('email')
    //     ? 'Not a valid email'
    //     : '';
  }
}
