import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/reducers/app.reducers';
import * as ChannelsListActions from '../../store/actions/channelsList.actions';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {Channel} from '../../channels/channel.model';
import 'rxjs/operator/do';

@Component({
  selector: 'app-client-main',
  templateUrl: './client-main.component.html',
  styleUrls: ['./client-main.component.scss']
})
export class ClientMainComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('messagesContainer') messagesContainer: ElementRef;

  channels: Observable<Channel[]>;
  channelsLoadedStateSub: Subscription;
  messagesHeight = 0;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.channels = this.store.select(state => state.channelsList.channels);
    this.route.paramMap.subscribe(
      params => {
        const selectedChannelId = params.get('id');

        /**
         * There are situations where channels have not been loaded from the server when reaching this point. We subscribe to
         * 'channelsLoaded' state of the store which will return the current value of 'channelsLoaded' state first. If it is false, it
         * means that channels have not been loaded from the server and hence we are unable to find the selected channel from an empty
         * array, so we do nothing. When channels are loaded from the server, the value of channelsLoaded state of the store will be
         * updated to true and since we have subscribed to the state, so that we get notified of the change and then we are able to
         * dispatch the 'SELECT_CHANNEL' action to set the selectedChannel state of the store.
         */
        if (selectedChannelId) {
          this.channelsLoadedStateSub = this.store.select(state => state.channelsList.channelsLoaded).subscribe(
            channelsLoadedState => {
              if (channelsLoadedState) {
                this.store.dispatch(new ChannelsListActions.SelectChannel(selectedChannelId));
              }
            }
          );
        }
      }
    );
  }

  ngAfterViewChecked() {
    // Scroll to bottom (chat style) in a chat window
    // Reference: https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
    // PS: We only scroll to bottom when the messages list height changes.
    // Otherwise, it will scroll to bottom even when we type something the chat box.
    if (this.messagesHeight !== this.messagesContainer.nativeElement.scrollHeight) {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      this.messagesHeight = this.messagesContainer.nativeElement.scrollHeight;
    }
  }

  ngOnDestroy() {
    if (this.channelsLoadedStateSub) {
      this.channelsLoadedStateSub.unsubscribe();
    }
  }

}
