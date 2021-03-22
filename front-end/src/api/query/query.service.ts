import { Url } from './../api.url';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable()
export class QueryService {
    private appUrl: string;
    constructor(private urlservice: Url, private httpClient: HttpClient) {
        this.appUrl = this.urlservice.baseurl;
    }

    //Query all List
    getAllQuestion(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.post(this.appUrl + '/uSupport', reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }


    //Query Delete
    deleteQuestion(reqdata) {
        return this.httpClient.delete(this.appUrl + '/uSupport/' + reqdata).toPromise().then(res => res).catch(this.handleError);
    }

    //Query all List
    updateQuestion(primaryId, reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.put(this.appUrl + '/uSupport/' + primaryId, reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }



    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

}