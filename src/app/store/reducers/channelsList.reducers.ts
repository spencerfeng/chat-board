import * as ChannelsListActions from '../actions/channelsList.actions';
import {Channel} from '../../channels/channel.model';

export interface MessageCreatedBy {
  _id: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

export interface PopulatedMessage {
  _id: string;
  createdBy: MessageCreatedBy;
  createdAt: Date;
  body: string;
  channel: string;
}

export interface ChannelWithMessages {
  _id: string;
  name: string;
  createdBy: string;
  deletable: boolean;
  isDefault: boolean;
  createdAt: Date;
  messages: PopulatedMessage[];
}

export interface State {
  channels: ChannelWithMessages[];
  selectedChannel: Channel;
  channelsLoaded: boolean;
  startAddingNewChannel: boolean;
}

const initialState = {
  channels: [],
  selectedChannel: null,
  channelsLoaded: false,
  startAddingNewChannel: false
};

export function channelsListReducer(state = initialState, action: ChannelsListActions.ChannelsListActions) {
  switch (action.type) {
    case ChannelsListActions.ADD_CHANNEL_SUCCESS: {
      const channels = [...state.channels, action.payload];
      return {
        ...state,
        channels: channels,
        startAddingNewChannel: false
      };
    }
    case ChannelsListActions.GET_CHANNELS_SUCCESS: {
      return {
        ...state,
        channels: action.payload,
        channelsLoaded: true
      };
    }
    case ChannelsListActions.GET_MESSAGES_FOR_A_CHANNEL_SUCCESS: {
      const selectedChannel = state.channels.find(channel => {
        return channel._id === action.payload.channelId;
      });
      const updatedSelectedChannel = {
        ...selectedChannel,
        messages: action.payload.messages
      };
      const updatedChannels = state.channels.filter(channel => {
        return channel._id !== action.payload.channelId;
      });
      return {
        ...state,
        channels: [...updatedChannels, updatedSelectedChannel].sort((a, b) => {
          if (a.createdAt < b.createdAt) { return -1; }
          if (a.createdAt > b.createdAt) { return 1; }
          return 0;
        })
      };
    }
    case ChannelsListActions.SELECT_CHANNEL: {
      let selectedChannel = state.channels.find(channel => {
        return channel._id === action.payload;
      });
      if (!selectedChannel) {
        selectedChannel = state.channels.find(channel => {
          return channel.name === 'general';
        });
      }
      return {
        ...state,
        selectedChannel: selectedChannel
      };
    }
    case ChannelsListActions.TOGGLE_ADDING_NEW_CHANNEL: {
      return {
        ...state,
        startAddingNewChannel: !state.startAddingNewChannel
      };
    }
    case ChannelsListActions.RESET_CHANNELS_LIST: {
      return {
        ...state,
        ...initialState
      };
    }
    case ChannelsListActions.SET_CHANNELS_LOADED_STATE: {
      return {
        ...state,
        channelsLoaded: action.payload
      };
    }
    case ChannelsListActions.DELETE_CHANNEL_SUCCESS: {
      const updatedChannels = [...state.channels].filter(channel => {
        return channel._id != action.payload;
      });
      return {
        ...state,
        channels: updatedChannels
      };
    }
    case ChannelsListActions.ADD_NEW_MESSAGE_SUCCESS: {
      const stateOfChannelMessageIsIn = state.channels.find(channel => {
        return channel._id === action.payload.channel;
      });
      const updatedStateOfChannelMessageIsIn = {
        ...stateOfChannelMessageIsIn,
        messages: stateOfChannelMessageIsIn.messages === null ? [action.payload] : [...stateOfChannelMessageIsIn.messages, action.payload]
      };
      const updatedStateOfChannels = state.channels.filter(channel => {
        return channel._id !== action.payload.channel;
      });
      return {
        ...state,
        channels: [...updatedStateOfChannels, updatedStateOfChannelMessageIsIn]
      };
    }
    case ChannelsListActions.DELETE_MESSAGE_SUCCESS: {
      const stateOfChannelMessageWasIn = state.channels.find(channel => {
        return channel._id === action.payload.channelId;
      });
      const updatedMessages = stateOfChannelMessageWasIn.messages.filter(message => {
        return message._id !== action.payload.messageId;
      });
      const updatedStateOfChannelMessageWasIn = {
        ...stateOfChannelMessageWasIn,
        messages: updatedMessages
      };
      const updatedStateOfChannels = state.channels.filter(channel => {
        return channel._id !== action.payload.channelId;
      });
      return {
        ...state,
        channels: [...updatedStateOfChannels, updatedStateOfChannelMessageWasIn]
      };
    }
    default:
      return state;
  }
}
