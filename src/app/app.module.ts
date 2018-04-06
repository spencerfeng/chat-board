import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { ClientComponent } from './client/client.component';
import { routing } from './app.routing';
import { ChannelService } from './channels/channel.service';
import { ChannelsComponent } from './channels/channels.component';
import { ChannelsListComponent } from './channels/channels-list/channels-list.component';
import { ChannelCreateComponent } from './channels/channel-create/channel-create.component';
import { MessagesListComponent } from './messages/messages-list/messages-list.component';
import {MessageService} from './messages/message.service';
import { MessageCreateComponent } from './messages/message-create/message-create.component';
import { ClientSidebarComponent } from './client/client-sidebar/client-sidebar.component';
import { ClientMainComponent } from './client/client-main/client-main.component';
import { ClientMainHeaderComponent } from './client/client-main/client-main-header/client-main-header.component';
import { ClientMainBodyComponent } from './client/client-main/client-main-body/client-main-body.component';
import { ClientMainFooterComponent } from './client/client-main/client-main-footer/client-main-footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthComponent } from './auth/auth.component';
import { AuthService } from './auth/auth.service';
import {UserService} from './shared/user.service';
import {AuthGuard} from './auth-guard.service';
import {channelsListReducer} from './store/reducers/channelsList.reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment'; // Angular CLI environemnt
import {authReducer} from './store/reducers/auth.reducers';
import {ChatService} from './shared/chat.service';
import { ErrorComponent } from './errors/error.component';
import {ErrorService} from './errors/error.service';
import {AnonymousGuard} from './anonymous-guard.service';
import {AppSettings} from './shared/app-settings.service';

@NgModule({
  declarations: [
    AppComponent,
    ClientComponent,
    ChannelsComponent,
    ChannelsListComponent,
    ChannelCreateComponent,
    MessagesListComponent,
    MessageCreateComponent,
    ClientSidebarComponent,
    ClientMainComponent,
    ClientMainHeaderComponent,
    ClientMainBodyComponent,
    ClientMainFooterComponent,
    SigninComponent,
    SignupComponent,
    AuthComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing,
    StoreModule.forRoot({
      channelsList: channelsListReducer,
      auth: authReducer
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production // Restrict extension to log-only mode
    })
  ],
  providers: [
    ChannelService,
    MessageService,
    AuthService,
    UserService,
    AuthGuard,
    AnonymousGuard,
    ChatService,
    ErrorService,
    AppSettings
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
