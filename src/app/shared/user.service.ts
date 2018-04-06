import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AppSettings} from './app-settings.service';

@Injectable()
export class UserService {

  constructor(
    private httpClient: HttpClient
  ) {}

  updateUser(userId, updateOps) {
    return this.httpClient.patch(`${AppSettings.API_ENDPOINT}/users/${userId}${this.getTokenQueryString()}`, updateOps);
  }

  getTokenQueryString() {
    return localStorage.getItem('token') ? `?token=${localStorage.getItem('token')}` : '';
  }

}
