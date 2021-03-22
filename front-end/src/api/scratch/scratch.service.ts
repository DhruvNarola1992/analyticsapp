import { Url } from './../api.url';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable()
export class ScratchService {
    private appUrl: string;
    constructor(private urlservice: Url, private httpClient: HttpClient) {
        this.appUrl = this.urlservice.baseurl;
    }

    getAllScratch() {
        return this.httpClient.get(this.appUrl + '/uTask/getScratch').toPromise().then(res => res).catch(this.handleError);
    }

    addScratch(reqdata) {
       return this.httpClient.post(this.appUrl + '/uTask/addScratch', reqdata).toPromise().then(res => res).catch(this.handleError);
    }

    updateScratch(reqdata) {
        return this.httpClient.put(this.appUrl + '/uTask/updateScratch', reqdata).toPromise().then(res => res).catch(this.handleError);
    }

    deleteScratch(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.put(this.appUrl + '/uTask/allTask/deleteScratch', reqdata , {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

}