import { Url } from './../api.url';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable()
export class PaymentService {
    private appUrl: string;
    constructor(private urlservice: Url, private httpClient: HttpClient) {
        this.appUrl = this.urlservice.baseurl;
    }

    //Withdraw Details on all type -- pending, success, cancel 
    getAllWithdraw(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.post(this.appUrl + '/uWithdraw', reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    //Withdraw Cancel and User Deactive only one user
    updateUserDeactive(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.put(this.appUrl + '/uWithdraw', reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    //User Withdraw History 
    withdrawHistoryUser(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.post(this.appUrl + '/uWithdraw/withdrawhistory', reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    //User Activity History
    activityHistoryUser(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.post(this.appUrl + '/uWithdraw/user/activity', reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    //User Bulk De-active and Delete Withdraw Cancle
    updateBulkUser(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.put(this.appUrl + '/uWithdraw/bulkDelete', reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    //User Bulk Withdraw Success All
    updateBulkWithdrawUser(reqdata) {
        return this.httpClient.get(this.appUrl + '/uWithdraw/' + reqdata).toPromise().then(res => res).catch(this.handleError);
    }

    
    downloadBulkWithdraw() {
        return this.httpClient.get(this.appUrl + '/uWithdraw',{ responseType: 'text'}).toPromise().then(res => res).catch(this.handleError);
    }


  

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

}