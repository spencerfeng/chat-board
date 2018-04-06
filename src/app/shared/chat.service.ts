import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';
import * as fromChannelsList from '../store/reducers/channelsList.reducers';

export class ChatService {

  private url = 'http://localhost:3000';
  socket = io(this.url);

  broadcastNewChannelAddedToServer(channel: fromChannelsList.ChannelWithMessages) {
    this.socket.emit('new-channel-added', channel);
  }

  getNewChannelAddedBroadcastFromServer() {
    return Observable.create(obs => {
      this.socket.on('new-channel-added-broadcast-from-server', (data: fromChannelsList.ChannelWithMessages) => {
        obs.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

  broadcastNewMessageAddedToServer(message: fromChannelsList.PopulatedMessage) {
    this.socket.emit('new-message-added', message);
  }

  getNewMessageAddedBroadcastFromServer() {
    return Observable.create(obs => {
      this.socket.on('new-message-added-broadcast-from-server', (data: fromChannelsList.PopulatedMessage) => {
        obs.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

  broadcastMessageDeletedFromChannelToServer(messageId: string, channelId: string) {
    this.socket.emit('message-deleted', {
      messageId: messageId,
      channelId: channelId
    });
  }

  getMessageDeletedBroadcastFromServer() {
    return Observable.create(obs => {
      this.socket.on('message-deleted-broadcast-from-server', (data: {messageId: string, channelId: string}) => {
        obs.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

  broadcastChannelDeletedToServer(channelId: string) {
    this.socket.emit('channel-deleted', {
      channelId: channelId
    });
  }

  getChannelDeletedBroadcastFromServer() {
    return Observable.create(obs => {
      this.socket.on('channel-deleted-broadcast-from-server', (data: {channelId: string}) => {
        obs.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

}
