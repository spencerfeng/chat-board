import {Component, OnDestroy, OnInit} from '@angular/core';
import { Channel } from '../channel.model';
import { ChannelService } from '../channel.service';
import { Subscription } from 'rxjs/Subscription';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/reducers/app.reducers';
import * as ChannelsListActions from '../../store/actions/channelsList.actions';
import {ChatService} from '../../shared/chat.service';
import * as fromAuth from '../../store/reducers/auth.reducers';
import {ErrorService} from '../../errors/error.service';

@Component({
  selector: 'app-channels-list',
  templateUrl: './channels-list.component.html',
  styleUrls: ['./channels-list.component.scss']
})
export class ChannelsListComponent implements OnInit, OnDestroy {
  channelsState: Observable<Channel[]>;
  authState: Observable<fromAuth.State>;
  authStateSub: Subscription;
  private authStateLastViewedChannelSub1: Subscription;
  private authStateLastViewedChannelSub2: Subscription;
  private authIsLoadedStateSub: Subscription;
  private getNewChannelAddedBroadcastFromServerSub: Subscription;
  private channelsStateSub: Subscription;
  private getChannelDeletedBroadcastFromServerSub: Subscription;
  private errorService: ErrorService;

  constructor(
    private channelService: ChannelService,
    private router: Router,
    private store: Store<fromApp.AppState>,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.channelsState = this.store.select(state => state.channelsList.channels);
    this.authState = this.store.select(state => state.auth);

    /**
     * Get channels from the server
     */
    this.channelService.getChannels()
      .subscribe(
        channels => {
          if (channels.length) {
            const channelsFromServer = channels.map(channel => {
              return {
                _id: channel._id,
                name: channel.name,
                createdBy: channel.createdBy,
                deletable: channel.deletable,
                isDefault: channel.isDefault,
                createdAt: channel.createdAt,
                messages: null
              };
            });
            this.store.dispatch(new ChannelsListActions.GetChannelsSuccess(channelsFromServer));
          } else {
            const defaultChannel = new Channel(
              '',
              'general',
              '',
              false,
              true,
              new Date()
            );
            this.channelService.addChannel(defaultChannel)
              .subscribe(
                data => {
                  const defaultChannelWithMessages = {
                    _id: data.obj._id,
                    name: data.obj.name,
                    createdBy: data.obj.createdBy,
                    deletable: data.obj.deletable,
                    isDefault: data.obj.isDefault,
                    createdAt: data.obj.createdAt,
                    messages: []
                  };
                  this.store.dispatch(new ChannelsListActions.AddChannelSuccess(defaultChannelWithMessages));

                  // Update channelsLoaded state to true
                  // so that selectedChannel state can be set
                  this.store.dispatch(new ChannelsListActions.SetChannelsLoadedState(true));

                  // Let the server know that a new channel was created from this client via Socket IO
                  this.chatService.broadcastNewChannelAddedToServer(defaultChannelWithMessages);

                  // Navigate the new channel
                  this.router.navigateByUrl(`/messages/${defaultChannelWithMessages._id}`);
                },
                error => {
                  console.error(error);
                }
              );
          }

          /**
           * Always get the 'lastViewedChannel' state after channels are loaded, otherwise it is not possible to get the channel object
           * if the channels array is empty
           */
          this.authIsLoadedStateSub = this.store.select(state => state.auth.isLoaded)
            .do(isLoaded => {
              if (isLoaded) {
                this.authStateSub = this.store.select(state => state.auth)
                  .take(1)
                  .do(auth => {
                    const lastViewedChannel = auth.lastViewedChannel;
                    if (lastViewedChannel) {
                      this.router.navigateByUrl(`/messages/${lastViewedChannel}`);
                    } else {
                      if (channels.length) {
                        const defaultChannel = channels.find((channel) => {
                          return channel.name === 'general';
                        });
                        this.router.navigateByUrl(`/messages/${defaultChannel._id}`);
                      }
                    }
                  })
                  .subscribe();
              }
            })
            .subscribe();
        },
        error => {
          console.error(error);
        }
      );

    /**
     * Subscribe to Socket IO broadcast
     */
    this.getChannelDeletedBroadcastFromServerSub = this.chatService.getChannelDeletedBroadcastFromServer()
      .subscribe(
        data => {
          this.store.dispatch(new ChannelsListActions.DeleteChannelSuccess(data.channelId));
          this.authStateLastViewedChannelSub1 = this.store.select(state => state.auth.lastViewedChannel).take(1)
            .subscribe(
              lastViewedChannel => {
                if (lastViewedChannel === data.channelId) {
                  this.channelsStateSub = this.store.select(state => state.channelsList.channels).take(1)
                    .subscribe(
                      channels => {
                        const defaultChannel = channels.find(channel => {
                          return channel.isDefault === true;
                        });

                        this.router.navigateByUrl(`/messages/${defaultChannel._id}`);
                      }
                    );
                }
              }
            );
        }
      );

    this.getNewChannelAddedBroadcastFromServerSub = this.chatService.getNewChannelAddedBroadcastFromServer()
      .subscribe(
        data => {
          this.store.dispatch(new ChannelsListActions.AddChannelSuccess(data));
        }
      );
  }

  deleteChannel(channelId: string) {
    this.channelService.deleteChannel(channelId)
      .subscribe(
        data => {
          this.store.dispatch(new ChannelsListActions.DeleteChannelSuccess(channelId));
          this.authStateLastViewedChannelSub2 = this.store.select(state => state.auth.lastViewedChannel).take(1)
            .subscribe(
              lastViewedChannel => {
                if (lastViewedChannel === channelId) {
                  this.channelsStateSub = this.store.select(state => state.channelsList.channels).take(1)
                    .subscribe(
                      channels => {
                        const defaultChannel = channels.find(channel => {
                          return channel.isDefault === true;
                        });

                        this.router.navigateByUrl(`/messages/${defaultChannel._id}`);
                      }
                    );
                }
              }
            );

          // Broadcast 'channel-deleted' via Socket IO
          this.chatService.broadcastChannelDeletedToServer(channelId);
        },
        error => {
          this.errorService.handleError(error.error);
        }
      );
  }

  ngOnDestroy() {
    if (this.authStateSub) {
      this.authStateSub.unsubscribe();
    }

    if (this.authStateLastViewedChannelSub1) {
      this.authStateLastViewedChannelSub1.unsubscribe();
    }

    if (this.authStateLastViewedChannelSub2) {
      this.authStateLastViewedChannelSub2.unsubscribe();
    }

    if (this.channelsStateSub) {
      this.channelsStateSub.unsubscribe();
    }

    this.getNewChannelAddedBroadcastFromServerSub.unsubscribe();
    this.getChannelDeletedBroadcastFromServerSub.unsubscribe();
  }
}
