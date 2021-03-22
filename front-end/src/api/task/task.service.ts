import { Url } from './../api.url';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable()
export class TaskService {
    private appUrl: string;
    constructor(private urlservice: Url, private httpClient: HttpClient) {
        this.appUrl = this.urlservice.baseurl;
    }

    getAllTask() {
        return this.httpClient.get(this.appUrl + '/uTask').toPromise().then(res => res).catch(this.handleError);
    }

    addTask(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.post(this.appUrl + '/uTask', reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    updateTask(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.put(this.appUrl + '/uTask', reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    deleteTask(primaryid) {
        return this.httpClient.delete(this.appUrl + '/uTask/' + primaryid ).toPromise().then(res => res).catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

}