import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import * as fromApp from '../store/reducers/app.reducers';
import * as ChannelsListActions from '../store/actions/channelsList.actions';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {

  startAddingNewChannelState: Observable<boolean>;

  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.startAddingNewChannelState = this.store.select(state => state.channelsList.startAddingNewChannel);
  }

  toggleCreateChannel() {
    this.store.dispatch(new ChannelsListActions.ToggleAddingNewChannel());
  }

}
