import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/reducers/app.reducers';
import * as AuthActions from '../store/actions/auth.actions';
import {Subscription} from 'rxjs/Subscription';
import {ChatService} from '../shared/chat.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, OnDestroy {

  authStateSub: Subscription;

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    // Connect to socket io if it is disconnected
    if (!this.chatService.socket.connected) {
      this.chatService.socket.connect();
    }

    this.authStateSub = this.store.select(state => state.auth)
      .take(1)
      .subscribe(
        auth => {
          if (!auth.isLoaded) {
            this.authService.getLoggedInUser()
              .subscribe(
                data => {
                  this.store.dispatch(new AuthActions.GetLoggedInUserSuccess(data));
                },
                error => {
                  console.error(error);
                }
              );
          }
        });
  }

  ngOnDestroy() {
    this.authStateSub.unsubscribe();
  }

}
