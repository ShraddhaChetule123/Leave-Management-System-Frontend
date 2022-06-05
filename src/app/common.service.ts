import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  getLeaveRequest(token: any, request_id: any) {
    return this._http.get<any>(environment.url+'/leaves/'+request_id, this.getHeader(token))
  }


  constructor(private _http: HttpClient) {}

  login(body:any){
    return this._http.post<any>(environment.url+'/login',body);
  }
  create_account(body: any){
    return this._http.post<any>(environment.url+'/create_account',body);
  }
  get_session(token:string){
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': token})
    };
    return this._http.get(environment.url+'/session_info',httpOptions);
  }

  logout(token:any){
      return this._http.post<any>(environment.url+'/logout',
        {headers:new HttpHeaders({'Authorization': token})});
  }

  validate_login(param: { renew: any; token: string }) {
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': param.token})
    };
    return this._http.post<any>(environment.url+'/validate_login',{renew:param.renew}, httpOptions)
  }

  getTokenUser(token: string) {
    const httpOption = {
      headers : new HttpHeaders({'Authorization': token})
    }
    return this._http.get<any>(environment.url+'/get_token_user', httpOption);
  }

  getMyLeaves(token: string) {
    return this._http.get<any>(environment.url+'/leaves/my_leaves', {headers : new HttpHeaders({'Authorization': token})});
  }

  getLeaves(token: string, q:string) {
    return this._http.get<any>(environment.url+'/leaves?q='+q, {headers : new HttpHeaders({'Authorization': token})});
  }

  onboard(emp: any,token:string) {
    return this._http.post<any>(environment.url+'/employee/onboard',
      emp,{headers : new HttpHeaders({'Authorization': token})})
  }
  get_user(user_info:any, token:string){
    return this._http.get<any>(environment.url+'/get_user?q='+user_info,this.getHeader(token))
  }

  getHeader(token:string){
    return {headers : new HttpHeaders({'Authorization': token})}
  }

  getDepartment(token:any, did:any=null){
    let base_url = environment.url+'/employee/department';
    if (did==null){
      base_url +='?q=all'
    }else {
      base_url+='?q='+did
    }
    return this._http.get<any>(base_url,this.getHeader(token));
  }

  get_all_employee(token: any, id:any=null) {
    let base_url = environment.url+'/employee/';
    if (id==null){
      base_url +='?q=all'
    }else {
      base_url+='?q='+id
    }
    return this._http.get<any>(base_url,this.getHeader(token));
  }

  getManagers(token: any, mid:any=null) {
    let base_url = environment.url+'/employee/manager';
    if (mid==null){
      base_url +='?q=all'
    }else {
      base_url+='?q='+mid
    }
    return this._http.get<any>(base_url,this.getHeader(token));
  }
  updateEmployee(token:any, body:any){
    return this._http.put<any>(environment.url+'/employee/update', body, this.getHeader(token))
  }


  get_user_hardware(token: any, id:any=null) {
    let base_url = environment.url+'/employee/hardware';
    if (id==null){
      base_url +='?q=my'
    }else {
      base_url +='?q='+id
    }
    return this._http.get<any>(base_url,this.getHeader(token));
  }


//  LEAVES

  apply_leaves(token:any, body:any){
    return this._http.post<any>(environment.url+'/leaves/apply',body,this.getHeader(token));
  }

  delete_leaves(token:any, id:any){
    let options= {headers : new HttpHeaders({'Authorization': token}), body : {id:id}}
    return this._http.delete<any>(environment.url+'/leaves/delete', options)
  }
  update_leave(token:string, body:any){
    return this._http.put<any>(environment.url+'leaves/update',body,this.getHeader(token))
  }
}
