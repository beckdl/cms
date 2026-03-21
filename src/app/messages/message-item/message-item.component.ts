import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { Contact } from '../../contacts/contact.model';
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.css'
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  messageSender: string;

  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.updateSenderName();

    this.contactService.contactListChangedEvent.subscribe(() => {
      this.updateSenderName();
    });
  }

  private updateSenderName() {
    const contacts = this.contactService.contacts || [];
    const contact: Contact | undefined = contacts.find(c => c.id === this.message.sender);
    this.messageSender = contact ? contact.name : this.message.sender;
  }
}
