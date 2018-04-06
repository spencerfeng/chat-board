import { Channel } from './channel.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import {AppSettings} from '../shared/app-settings.service';

interface GetChannelResponse {
  _id: string;
  name: string;
  createdBy: string;
  deletable: boolean;
  isDefault: boolean;
  createdAt: Date;
}

interface CreateChannelResponse {
  message: string;
  obj: {
    _id: string,
    name: string,
    createdBy: string,
    deletable: boolean,
    isDefault: boolean,
    createdAt: Date
  };
}

interface DeleteChannelResponse {
  message: string;
  deletedChannel: Channel;
}

@Injectable()
export class ChannelService {

  constructor (
    private httpClient: HttpClient
  ) {}

  getChannels() {
    return this.httpClient.get<GetChannelResponse[]>(`${AppSettings.API_ENDPOINT}/channels${this.getTokenQueryString()}`);
  }

  addChannel(channel: Channel) {
    return this.httpClient.post<CreateChannelResponse>(`${AppSettings.API_ENDPOINT}/channels${this.getTokenQueryString()}`, channel);
  }

  deleteChannel(channelId: string) {
    return this.httpClient.delete<DeleteChannelResponse>(`${AppSettings.API_ENDPOINT}/channels/${channelId}${this.getTokenQueryString()}`);
  }

  getTokenQueryString() {
    return localStorage.getItem('token') ? `?token=${localStorage.getItem('token')}` : '';
  }

}
