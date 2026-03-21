import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent implements OnInit {
  messages = [];

  constructor(
    private messageService: MessageService,
    private contactService: ContactService
  ) { }

  ngOnInit() {
    this.contactService.getContacts();

    this.messageService.messageChangedEvent.subscribe((messages: Message[]) => {
      this.messages = messages;
    });
    this.messages = this.messageService.getMessages();
  }

  onAddMessage(message: Message) {
    this.messageService.addMessage(message);
  }

}
