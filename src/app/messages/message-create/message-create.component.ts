import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../message.service';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../message.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/reducers/app.reducers';
import {ChatService} from '../../shared/chat.service';
import {ErrorService} from '../../errors/error.service';
import * as ChannelsListActions from '../../store/actions/channelsList.actions';

@Component({
  selector: 'app-message-create',
  templateUrl: './message-create.component.html',
  styleUrls: ['./message-create.component.scss']
})
export class MessageCreateComponent implements OnInit {
  messageCreateForm: FormGroup;
  cChannelId: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private store: Store<fromApp.AppState>,
    private chatService: ChatService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.createForm();

    this.route.paramMap.subscribe(
      params => {
        this.cChannelId = params.get('id');
      }
    );
  }

  createForm() {
    this.messageCreateForm = this.fb.group({
      message: [
        '',
        Validators.required
      ]
    });
  }

  onSubmit() {
    const message = new Message(
      '',
      '',
      new Date(),
      this.messageCreateForm.value.message,
      this.cChannelId
    );

    this.messageService.addMessage(message)
      .subscribe(
        data => {
          this.store.dispatch(new ChannelsListActions.AddNewMessageSuccess(data.obj));

          // Tell other clients that a new message was added via socket io
          this.chatService.broadcastNewMessageAddedToServer(data.obj);

          this.messageCreateForm.reset();
        },
        error => {
          this.errorService.handleError(error.error);
        }
      );
  }

}

