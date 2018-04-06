import {Action} from '@ngrx/store';
import {Channel} from '../../channels/channel.model';
import * as fromChannelsList from '../reducers/channelsList.reducers';

export const ADD_CHANNEL_SUCCESS = 'ADD_CHANNEL_SUCCESS';
export const GET_CHANNELS_SUCCESS = 'GET_CHANNELS_SUCCESS';
export const SELECT_CHANNEL = 'SELECT_CHANNEL';
export const TOGGLE_ADDING_NEW_CHANNEL = 'TOGGLE_ADDING_NEW_CHANNEL';
export const RESET_CHANNELS_LIST = 'RESET_CHANNELS_LIST';
export const SET_CHANNELS_LOADED_STATE = 'SET_CHANNELS_LOADED_STATE';
export const DELETE_CHANNEL_SUCCESS = 'DELETE_CHANNEL_SUCCESS';
export const ADD_NEW_MESSAGE_SUCCESS = 'ADD_NEW_MESSAGE_SUCCESS';
export const DELETE_MESSAGE_SUCCESS = 'DELETE_MESSAGE_SUCCESS';
export const GET_MESSAGES_FOR_A_CHANNEL_SUCCESS = 'GET_MESSAGES_FOR_A_CHANNEL_SUCCESS';

export class AddChannelSuccess implements Action {
  readonly type = ADD_CHANNEL_SUCCESS;
  constructor(
    public payload: fromChannelsList.ChannelWithMessages
  ) {}
}

export class GetChannelsSuccess implements Action {
  readonly type = GET_CHANNELS_SUCCESS;
  constructor (
    public payload: fromChannelsList.ChannelWithMessages[]
  ) {}
}

export class GetMessagesForAChannelSuccess implements Action {
  readonly type = GET_MESSAGES_FOR_A_CHANNEL_SUCCESS;
  constructor (
    public payload: {
      channelId: string,
      messages: fromChannelsList.PopulatedMessage[]
    }
  ) {}
}

export class SelectChannel implements Action {
  readonly type = SELECT_CHANNEL;
  constructor (
    public payload: string
  ) {}
}

export class ToggleAddingNewChannel implements Action {
  readonly type = TOGGLE_ADDING_NEW_CHANNEL;
}

export class ResetChannelsList implements Action {
  readonly type = RESET_CHANNELS_LIST;
}

export class SetChannelsLoadedState implements Action {
  readonly type = SET_CHANNELS_LOADED_STATE;
  constructor (
    public payload: boolean
  ) {}
}

export class DeleteChannelSuccess implements Action {
  readonly type = DELETE_CHANNEL_SUCCESS;
  constructor (
    public payload: string
  ) {}
}

export class AddNewMessageSuccess implements Action {
  readonly type = ADD_NEW_MESSAGE_SUCCESS;
  constructor (
    public payload: fromChannelsList.PopulatedMessage
  ) {}
}

export class DeleteMessageSuccess implements Action {
  readonly type = DELETE_MESSAGE_SUCCESS;
  constructor (
    public payload: {
      channelId: string,
      messageId: string
    }
  ) {}
}

export type ChannelsListActions = AddChannelSuccess
                                | GetChannelsSuccess
                                | SelectChannel
                                | ToggleAddingNewChannel
                                | ResetChannelsList
                                | SetChannelsLoadedState
                                | DeleteChannelSuccess
                                | AddNewMessageSuccess
                                | DeleteMessageSuccess
                                | GetMessagesForAChannelSuccess;
