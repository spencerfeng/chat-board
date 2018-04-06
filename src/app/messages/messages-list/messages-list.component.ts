import {Component, OnDestroy, OnInit} from '@angular/core';
import { MessageService } from '../message.service';
import { ActivatedRoute } from '@angular/router';
import {UserService} from '../../shared/user.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/reducers/app.reducers';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import {Subscription} from 'rxjs/Subscription';
import * as AuthActions from '../../store/actions/auth.actions';
import {ChatService} from '../../shared/chat.service';
import * as fromAuth from '../../store/reducers/auth.reducers';
import * as fromChannelsList from '../../store/reducers/channelsList.reducers';
import {ErrorService} from '../../errors/error.service';
import * as ChannelsListActions from '../../store/actions/channelsList.actions';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss']
})

export class MessagesListComponent implements OnInit, OnDestroy {

  messagesForSelectedChannelState: Observable<fromChannelsList.PopulatedMessage[]>;
  getNewMessageAddedBroadcastFromServerSub: Subscription;
  getMessageDeletedBroadcastFromServerSub: Subscription;
  authState: Observable<fromAuth.State>;

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private chatService: ChatService,
    private errorService: ErrorService
  ) { }

  ngOnInit() {
    this.authState = this.store.select(state => state.auth);

    this.route.paramMap.subscribe(
      params => {

        this.userService.updateUser(
          localStorage.getItem('userId'),
          {
            lastViewedChannel: params.get('id')
          }
        ).subscribe(
          data => {
            console.log('The user has been updated');

            this.store.dispatch(new AuthActions.UpdateLoggedInUserLastViewedChannelSuccess(params.get('id')));
          },
          error => {
            console.error(error);
          }
        );

        this.messagesForSelectedChannelState = this.store.select(state => {
          const channelsState = state.channelsList.channels;
          const selectedChannel = channelsState.find(channel => {
            return channel._id === params.get('id');
          });
          if (selectedChannel) {
            return selectedChannel.messages;
          }
        })
          .do(messages => {
            if (messages === null) {
              this.messageService.getMessagesForChannel(params.get('id'))
                .subscribe(
                  messagesForSelectedChannel => {
                    if (messagesForSelectedChannel.length) {
                      this.store.dispatch(new ChannelsListActions.GetMessagesForAChannelSuccess({
                        channelId: params.get('id'),
                        messages: messagesForSelectedChannel
                      }));
                    } else {
                      this.store.dispatch(new ChannelsListActions.GetMessagesForAChannelSuccess({
                        channelId: params.get('id'),
                        messages: []
                      }));
                    }
                  },
                  error => {
                    console.error(error);
                  }
                );
            }
          });
      }
    );

    /**
     * Subscribe to Socket IO broadcast
     */
    this.getNewMessageAddedBroadcastFromServerSub = this.chatService.getNewMessageAddedBroadcastFromServer()
      .subscribe(
        data => {
          this.store.dispatch(new ChannelsListActions.AddNewMessageSuccess(data));
        }
      );

    this.getMessageDeletedBroadcastFromServerSub = this.chatService.getMessageDeletedBroadcastFromServer()
      .subscribe(
        data => {
          this.store.dispatch(new ChannelsListActions.DeleteMessageSuccess({
            channelId: data.channelId,
            messageId: data.messageId
          }));
        }
      );
  }

  deleteMessage(messageId) {
    this.messageService.deleteMessage(messageId)
      .subscribe(
        data => {
          const deletedMessage = data.deletedMessage;
          this.store.dispatch(new ChannelsListActions.DeleteMessageSuccess({
            channelId: deletedMessage.channel,
            messageId: deletedMessage._id
          }));

          // Broadcast to other clients that the message has been deleted via Socket IO
          this.chatService.broadcastMessageDeletedFromChannelToServer(deletedMessage._id, deletedMessage.channel);
        },
        error => {
          this.errorService.handleError(error.error);
        }
      );
  }

  ngOnDestroy() {
    this.getNewMessageAddedBroadcastFromServerSub.unsubscribe();
    this.getMessageDeletedBroadcastFromServerSub.unsubscribe();
  }

}
