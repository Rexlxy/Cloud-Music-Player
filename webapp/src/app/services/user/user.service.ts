import { Injectable } from '@angular/core';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Md5} from 'ts-md5';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private  apiService: ApiService) { }

  public login(username: string, password: string): Observable<any> {
    let url =  '/api/user/login?';
    url += 'username=' + username;
    url += '&pw=' + Md5.hashStr(password, false);
    return  this.apiService.get(url);
  }

  public logout(): Observable<any> {
    return this.apiService.get('/api/user/logout');
  }
}
