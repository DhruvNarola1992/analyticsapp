import { Url } from './../api.url';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable()
export class ApplicationService {
    private appUrl: string;
    constructor(private urlservice: Url, private httpClient: HttpClient) {
        this.appUrl = this.urlservice.baseurl;
    }

    getAllApplication() {
        return this.httpClient.get(this.appUrl + '/uApplication').toPromise().then(res => res).catch(this.handleError);
    }

    addApplication(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.post(this.appUrl + '/uApplication', reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    updateApplication(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.put(this.appUrl + '/uApplication', reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

}