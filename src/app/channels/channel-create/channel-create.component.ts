import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChannelService } from '../channel.service';
import { Channel } from '../channel.model';
import * as ChannelsListActions from '../../store/actions/channelsList.actions';
import * as fromApp from '../../store/reducers/app.reducers';
import { Store } from '@ngrx/store';
import {Router} from '@angular/router';
import {ChatService} from '../../shared/chat.service';
import {ErrorService} from '../../errors/error.service';

@Component({
  selector: 'app-channel-create',
  templateUrl: './channel-create.component.html',
  styleUrls: ['./channel-create.component.scss']
})
export class ChannelCreateComponent implements OnInit {
  channelCreateForm: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private channelService: ChannelService,
    private store: Store<fromApp.AppState>,
    private router: Router,
    private chatService: ChatService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.channelCreateForm = this.fb.group({
      name: [
        '',
        Validators.required
      ]
    });
  }

  onSubmit() {
    this.submitting = true;

    const channel: Channel = new Channel(
      '',
      this.channelCreateForm.value.name,
      '',
      true,
      false,
      new Date()
    );
    this.channelService.addChannel(channel)
      .subscribe(
        data => {
          const channelWithMessages = {
            _id: data.obj._id,
            name: data.obj.name,
            createdBy: data.obj.createdBy,
            deletable: data.obj.deletable,
            isDefault: data.obj.isDefault,
            createdAt: data.obj.createdAt,
            messages: []
          };
          this.store.dispatch(new ChannelsListActions.AddChannelSuccess(channelWithMessages));

          // Let the server know that a new channel was created from this client
          this.chatService.broadcastNewChannelAddedToServer(channelWithMessages);

          // Navigate the new channel
          this.router.navigateByUrl(`/messages/${channelWithMessages._id}`);

          this.submitting = false;
        },
        error => {
          this.errorService.handleError(error.error);

          this.submitting = false;
        }
      );
  }
}
