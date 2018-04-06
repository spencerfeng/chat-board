import {Component, OnInit} from '@angular/core';
import { Channel } from '../../../channels/channel.model';
import { Store } from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import * as fromApp from '../../../store/reducers/app.reducers';

@Component({
  selector: 'app-client-main-header',
  templateUrl: './client-main-header.component.html',
  styleUrls: ['./client-main-header.component.scss']
})
export class ClientMainHeaderComponent implements OnInit {
  selectedChannel: Observable<Channel>;

  constructor(
    private store: Store<fromApp.AppState>,
  ) {}

  ngOnInit() {
    this.selectedChannel = this.store.select(state => state.channelsList.selectedChannel);
  }
}
