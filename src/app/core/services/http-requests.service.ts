import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { LoginStatusService } from './login-status.service';
import { UserMessages } from './../models/user-messages.model';
import { environment } from './../../../environments/environment';
import { UserMessagesService } from './user-messages.service';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {
  private requestHeader: HttpHeaders;
  private requestOptions: {headers: HttpHeaders};
  private baseUrl: string;
  private hostUrl: string;
  private token: BehaviorSubject < string > = new BehaviorSubject('');
  /* the event that informs listeners about the token updates */
  $token: Observable < string > = this.token.asObservable();
  constructor(private http: HttpClient, private userMessagesService: UserMessagesService, private loginStatusService: LoginStatusService) {
    this.baseUrl = environment.baseUrl;
    this.hostUrl = environment.hostUrl;
    this.requestHeader = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
    this.removeTokenOnLogout();
    const token = localStorage.getItem('token');
    if (token) {
      this.appendAuthorizationToRequestHeader(token);
    }
  }

   /**
   * @author Nermeen Mattar
   * @description It listens to login state to remove the token when the user logs out so that any subsequent request will not include
   * authorization property (unauthorized user)
   */
  removeTokenOnLogout() {
    this.loginStatusService.$userLoginState.subscribe( isLoggedIn => {
      if (!isLoggedIn) {
        this.removeAuthorizationFromRequestHeader();
      }
    });
  }

  updateTokenIfNeeded(token?: string) {
    if (token) {
      localStorage.setItem('token', token);
      this.token.next(token);
      this.appendAuthorizationToRequestHeader(token);
    }
  }

  appendAuthorizationToRequestHeader(token: string) {
    this.requestHeader =  this.requestHeader.set('Authorization', `Bearer ${token}`);
    this.setHttpRequestOptions();
  }

  removeAuthorizationFromRequestHeader() {
    localStorage.removeItem('token');
    this.requestHeader =  this.requestHeader.delete('Authorization');
    this.setHttpRequestOptions();
  }

  setHttpRequestOptions() {
    this.requestOptions = {
      headers: this.requestHeader
    };
  }

  public httpGet(requestUrl: string, userMessages ?: UserMessages): Observable < any > {
    return this.http.get(this.baseUrl + requestUrl, this.requestOptions)
      .pipe(
        map((res: any) => {
          this.defaultSuccessHandler(res, userMessages);
          return res.data;
        }),
        catchError(err => {
          this.defaultErrorHandler(err, userMessages);
          return throwError(err);
        })
      );
  }

  public hostHttpGet(requestUrl: string, userMessages?: UserMessages): Observable<any> {
    return this.http.get(this.hostUrl + requestUrl, this.requestOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(err => {
          return throwError(err);
        })
      );
  }

  public httpPost(requestUrl: string, requestParams ?: Object, userMessages ?: UserMessages): Observable < any > {
    return this.http.post(this.baseUrl + requestUrl, requestParams, this.requestOptions).pipe(
      map((res: any) => {
          this.defaultSuccessHandler(res, userMessages);
          return res.data ? res.data : res;
        }),
        catchError(err => {
          this.defaultErrorHandler(err, userMessages);
          return throwError(err);
        })
    );
  }

  public httpPut(requestUrl: string, requestParams ?: Object, userMessages?: UserMessages): Observable < any > {
    return this.http.put(this.baseUrl + requestUrl, requestParams, this.requestOptions).pipe(
      map((res: any) => {
          this.defaultSuccessHandler(res, userMessages);
          return res.data ? res.data : res;
        }),
        catchError(err => {
          this.defaultErrorHandler(err, userMessages);
          return throwError(err);
        })
    );
  }

  public httpDelete(requestUrl: string, userMessages?: UserMessages): Observable < any > {
     return this.http.delete(this.baseUrl + requestUrl, this.requestOptions).pipe(
      map((res: any) => {
          this.defaultSuccessHandler(res, userMessages);
          return res.data ? res.data : res;
        }),
        catchError(err => {
          this.defaultErrorHandler(err, userMessages);
          return throwError(err);
        })
    );
  }

  defaultSuccessHandler(res, userMessages) {
    this.userMessagesService.showUserMessage(userMessages, 'success');
    this.updateTokenIfNeeded(res.jwt || res.token);
    localStorage.setItem('lastSuccessfulRequestTimeStamp', JSON.stringify(new Date()));
  }

  defaultErrorHandler(error: HttpErrorResponse, userMessages: UserMessages) {
    this.userMessagesService.showUserMessage(userMessages, 'fail', error);
    if (error.error.statusCode === 401) {
      this.loginStatusService.logout();
    }
  }
}
