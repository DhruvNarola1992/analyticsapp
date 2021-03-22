import { Url } from './../api.url';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable()
export class ReportService {
    private appUrl: string;
    constructor(private urlservice: Url, private httpClient: HttpClient) {
        this.appUrl = this.urlservice.baseurl;
    }

    //Report Service Type
    getReport(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.post(this.appUrl + '/uReport', reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    //Getapplication list
    getApplication(){
        return this.httpClient.get(this.appUrl + '/uReport').toPromise().then(res => res).catch(this.handleError);
    }

   
    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

}