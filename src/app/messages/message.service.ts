import { Message } from './message.model';
import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as fromChannelsList from '../store/reducers/channelsList.reducers';
import {AppSettings} from '../shared/app-settings.service';

interface GetMessageResponse {
  _id: string;
  createdBy: fromChannelsList.MessageCreatedBy;
  createdAt: Date;
  body: string;
  channel: string;
}

interface CreateMessageResponse {
  message: string;
  obj: fromChannelsList.PopulatedMessage;
}

interface DeleteMessageResponse {
  message: string;
  deletedMessage: {
    _id: string,
    createdBy: string,
    createdAt: Date,
    body: string,
    channel: string
  };
}

@Injectable()
export class MessageService {

  constructor (
    private httpClient: HttpClient
  ) {}

  getMessagesForChannel(channelId: string) {
    return this.httpClient
      .get<GetMessageResponse[]>(`${AppSettings.API_ENDPOINT}/messages/channels/${channelId}${this.getTokenQueryString()}`);
  }

  addMessage(message: Message) {
    return this.httpClient.post<CreateMessageResponse>(`${AppSettings.API_ENDPOINT}/messages${this.getTokenQueryString()}`, message);
  }

  deleteMessage(messageId: string) {
    return this.httpClient
      .delete<DeleteMessageResponse>(`${AppSettings.API_ENDPOINT}/messages/${messageId}${this.getTokenQueryString()}`);
  }

  getTokenQueryString() {
    return localStorage.getItem('token') ? `?token=${localStorage.getItem('token')}` : '';
  }

}
