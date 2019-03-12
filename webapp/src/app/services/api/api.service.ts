import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/internal/operators';

import {Observable, throwError} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
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
