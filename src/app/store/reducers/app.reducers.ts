import * as fromChannelsList from './channelsList.reducers';
import * as fromAuth from './auth.reducers';

export interface AppState {
  channelsList: fromChannelsList.State;
  auth: fromAuth.State;
}
