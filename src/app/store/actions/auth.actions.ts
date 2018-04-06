import { Action } from '@ngrx/store';
import * as fromAuth from '../reducers/auth.reducers';

export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const GET_LOGGED_IN_USER_SUCCESS = 'GET_LOGGED_IN_USER_SUCCESS';
export const UPDATE_LOGGED_IN_USER_LAST_VIEWED_CHANNEL_SUCCESS = 'UPDATE_LOGGED_IN_USER_LAST_VIEWED_CHANNEL_SUCCESS';
export const RESET_AUTH = 'RESET_AUTH';

export class SignUpSuccess implements Action {
  readonly type = SIGN_UP_SUCCESS;
  constructor (
    public payload: fromAuth.LoggedInUserInfo
  ) {}
}

export class SignInSuccess implements Action {
  readonly type = SIGN_IN_SUCCESS;
  constructor (
    public payload: fromAuth.LoggedInUserInfo
  ) {}
}

export class GetLoggedInUserSuccess implements Action {
  readonly type = GET_LOGGED_IN_USER_SUCCESS;
  constructor (
    public payload: fromAuth.LoggedInUserInfo
  ) {}
}

export class UpdateLoggedInUserLastViewedChannelSuccess implements Action {
  readonly type = UPDATE_LOGGED_IN_USER_LAST_VIEWED_CHANNEL_SUCCESS;
  constructor (
    public payload: string
  ) {}
}

export class ResetAuth implements Action {
  readonly type = RESET_AUTH;
}

export type AuthActions = SignUpSuccess | SignInSuccess | GetLoggedInUserSuccess | UpdateLoggedInUserLastViewedChannelSuccess | ResetAuth;
