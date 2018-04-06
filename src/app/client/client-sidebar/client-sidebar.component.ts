import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import { Store } from '@ngrx/store';
import * as fromAuth from '../../store/reducers/auth.reducers';
import * as fromApp from '../../store/reducers/app.reducers';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-client-sidebar',
  templateUrl: './client-sidebar.component.html',
  styleUrls: ['./client-sidebar.component.scss']
})
export class ClientSidebarComponent implements OnInit {

  authState: Observable<fromAuth.State>;

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.authState = this.store.select(state => state.auth);
  }

  logout() {
    this.authService.signOut();
  }

}
