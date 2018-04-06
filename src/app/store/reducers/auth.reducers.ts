import * as AuthActions from '../actions/auth.actions';

export interface LoggedInUserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  lastViewedChannel: string;
  isAdmin: boolean;
  isLoaded: boolean;
}

export interface State {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  lastViewedChannel: string;
  isAdmin: boolean;
  isLoaded: boolean;
}

const initialState = {
  userId: '',
  firstName: '',
  lastName: '',
  email: '',
  lastViewedChannel: '',
  isAdmin: false,
  isLoaded: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.SIGN_UP_SUCCESS:
      return {
        ...state,
        userId: action.payload._id,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        lastViewedChannel: action.payload.lastViewedChannel,
        isAdmin: action.payload.isAdmin,
        isLoaded: true
      };
    case AuthActions.SIGN_IN_SUCCESS:
      return {
        ...state,
        userId: action.payload._id,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        lastViewedChannel: action.payload.lastViewedChannel,
        isAdmin: action.payload.isAdmin,
        isLoaded: true
      };
    case AuthActions.GET_LOGGED_IN_USER_SUCCESS:
      return {
        ...state,
        userId: action.payload._id,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        lastViewedChannel: action.payload.lastViewedChannel,
        isAdmin: action.payload.isAdmin,
        isLoaded: true
      };
    case AuthActions.UPDATE_LOGGED_IN_USER_LAST_VIEWED_CHANNEL_SUCCESS:
      return {
        ...state,
        lastViewedChannel: action.payload
      };
    case AuthActions.RESET_AUTH:
      return {
        ...state,
        ...initialState
      };
    default:
      return state;
  }
}
