import { Url } from './../api.url';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable()
export class BulkService {
    private appUrl: string;
    constructor(private urlservice: Url, private httpClient: HttpClient) {
        this.appUrl = this.urlservice.baseurl;
    }

    //Delete Bulk Activity
    deleteActivity(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.post(this.appUrl + '/uBulk', reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

   
    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

}