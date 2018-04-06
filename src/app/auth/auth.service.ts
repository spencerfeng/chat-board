import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/reducers/app.reducers';
import * as AuthActions from '../store/actions/auth.actions';
import * as ChannelsActions from '../store/actions/channelsList.actions';
import * as fromAuth from '../store/reducers/auth.reducers';
import {AppSettings} from '../shared/app-settings.service';

interface UserSignUpResponse {
  message: string;
  token: string;
  userId: string;
  user: fromAuth.LoggedInUserInfo;
}

interface UserSignInResponse {
  message: string;
  token: string;
  userId: string;
  user: fromAuth.LoggedInUserInfo;
}

interface CheckEmailNotTakenResponse {
  emailNotTaken: boolean;
}

@Injectable()
export class AuthService {

  constructor (
    private httpClient: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  signUp(user: User) {
    return this.httpClient.post<UserSignUpResponse>(`${AppSettings.API_ENDPOINT}/auth/users`, user);
  }

  signIn(loginCredentials: {email: string, password: string}) {
    return this.httpClient.post<UserSignInResponse>(`${AppSettings.API_ENDPOINT}/auth/signin`, loginCredentials);
  }

  signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.store.dispatch(new AuthActions.ResetAuth());
    this.store.dispatch(new ChannelsActions.ResetChannelsList());
    this.router.navigateByUrl('/auth/signin');
  }

  hasToken() {
    return localStorage.getItem('token') !== null;
  }

  getLoggedInUser() {
      return this.httpClient.get<fromAuth.LoggedInUserInfo>(`${AppSettings.API_ENDPOINT}/auth/user-info${this.getTokenQueryString()}`);
  }

  isAuthenticated() {
    return this.httpClient.get(`${AppSettings.API_ENDPOINT}/auth/user-info${this.getTokenQueryString()}`)
      .map(e => {
        if (e) {
          return true;
        }
      })
      .catch(() => {
        return Observable.of(false);
      });
  }

  checkEmailNotTaken(email: string) {
    return this.httpClient.post<CheckEmailNotTakenResponse>(`${AppSettings.API_ENDPOINT}/auth/checkEmailNotTaken`, {
      email: email
    });
  }

  getTokenQueryString() {
    return localStorage.getItem('token') ? `?token=${localStorage.getItem('token')}` : '';
  }
}
