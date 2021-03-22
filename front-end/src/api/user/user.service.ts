import { Url } from './../api.url';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable()
export class UserService {
    private appUrl: string;
    constructor(private urlservice: Url, private httpClient: HttpClient) {
        this.appUrl = this.urlservice.baseurl;
    }

    //User all data
    getAllUser(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.post(this.appUrl + '/uUser', reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    //User all Scratch data
    getTodayScratchAssignByUser(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.post(this.appUrl + '/uUser/scratchData', reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    //User all Spin and Task data
    getTodaySpinTaskAssignByUser(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.post(this.appUrl + '/uUser/task/spin', reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    //User all application work and data
    getUserByApplication(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.put(this.appUrl + '/uUser/getApplicationdata', reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    //Get User all details
    getUserDetails(userId) {
        return this.httpClient.get(this.appUrl + '/uUser/'+ userId).toPromise().then(res => res).catch(this.handleError);
    }

    //User Unique Key Update
    updateUserDetails(userId, referCode) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.put(this.appUrl + '/uUser/'+ userId + '/' + referCode, {},{
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    //Activity Combo-Box By Group wise (i.e. Master and Child Application Wise)
    getUserByApplicationActivity(userId) {
        return this.httpClient.get(this.appUrl + '/uUser/'+ userId + '/application').toPromise().then(res => res).catch(this.handleError);
    }


    //Activity By Group wise Application (i.e. Master and Child Application Wise)
    getUserActivityByApps(reqdata) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.put(this.appUrl + '/uUser', reqdata, {
            headers: httpHeaders
        }).toPromise().then(res => res).catch(this.handleError);
    }

    deleteUser(userId){
        return this.httpClient.delete(this.appUrl + '/uUser/'+ userId).toPromise().then(res => res).catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

}