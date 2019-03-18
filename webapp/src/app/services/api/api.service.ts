import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/internal/operators';

import {Observable, Subject, throwError} from 'rxjs';
import {FileModel} from '../../models/Models';
import {DialogComponent} from '../../file-explorer/file-explorer.component';
import {MatDialog} from '@angular/material';
import {LoginDialogComponent} from '../../login-dialog/login-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public static needToLogin: Subject<any> = new Subject();

  constructor(private http: HttpClient) {
  }

  static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else if (error.status === 401) {
      ApiService.needToLogin.next('open login dialog');
      return throwError(error);
    } else if (error.status >= 400) {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      return throwError(error);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }


  public get<T>(url: string): Observable<T> {
    return this.http.get<T>(url)
      .pipe(catchError(ApiService.handleError));
  }

  public post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body)
      .pipe(catchError(ApiService.handleError));
  }

  public put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body)
      .pipe(catchError(ApiService.handleError));
  }

  public delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url)
      .pipe(catchError(ApiService.handleError));
  }


}
