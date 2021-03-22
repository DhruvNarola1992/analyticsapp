import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Url } from './../api.url';

@Injectable()
export class ConstService {
    private appUrl : string;
    constructor(private urlservice: Url, private  httpClient : HttpClient ){
        this.appUrl = this.urlservice.baseurl;
    }

    sendGetConstant(){
        debugger
        return this.httpClient.get(this.appUrl + '/uCoin').toPromise().then(res=> res).catch(this.handleError);
    }

    updateConstant(primaryId, reqdata) {
        console.log(primaryId, reqdata)
        debugger;
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpClient.put(this.appUrl + '/uCoin/' + primaryId , reqdata, {
            headers: httpHeaders
        } ).toPromise().then(res => res).catch(this.handleError); 
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

}


    // allMore() {
    //     return this.http
    //         .get(this.appUrl + 'more', this.options)
    //         .toPromise()
    //         .then(res => res.json().data)
    //         .catch(this.handleError);
    // }

    // addMore(admin) {
    //     return this.http
    //         .post(this.appUrl + 'more', admin)
    //         .toPromise()
    //         .then(res => res.json())
    //         .catch(this.handleError);
    // }

    // deleteMore(id){
    //     return this.http
    //         .delete(this.appUrl + 'more/' + id , this.options)
    //         .toPromise()
    //         .then(res => res.json())
    //         .catch(this.handleError);
    // }


    // updateMore(id, data){
    //     return this.http
    //         .put(this.appUrl + 'more/' + id , data,this.options)
    //         .toPromise()
    //         .then(res => res.json())
    //         .catch(this.handleError);
    // }

    // updateImageMore(data){
    //     return this.http
    //         .put(this.appUrl + 'more', data)
    //         .toPromise()
    //         .then(res => res.json())
    //         .catch(this.handleError);
    // }

    // getMore(id) {
    //     return this.http
    //         .get(this.appUrl + 'more/' + id , this.options)
    //         .toPromise()
    //         .then(res => res.json())
    //         .catch(this.handleError);
    // }