import { Url } from './../api.url';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable()
export class NotifyService {
    private appUrl: string;
    constructor(private urlservice: Url, private httpClient: HttpClient) {
        this.appUrl = this.urlservice.baseurl;
    }

    getAllNotification() {
        return this.httpClient.get(this.appUrl + '/uNotify').toPromise().then(res => res).catch(this.handleError);
    }

    addNotification(reqdata) {
        return this.httpClient.post(this.appUrl + '/uNotify', reqdata).toPromise().then(res => res).catch(this.handleError);
    }

    updateNotification(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.put(this.appUrl + '/uNotify', reqdata , {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    deleteNotification(primaryid) {
       return this.httpClient.delete(this.appUrl + '/uNotify/' + primaryid).toPromise().then(res => res).catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

}