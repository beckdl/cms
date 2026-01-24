import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('1', 'Hey There!', 'Hello, how are you?', 'Alice'),
    new Message('2', 'Meeting Reminder', 'I will not forget the meeting tomorrow.', 'Bob'),
    new Message('3', 'Happy Birthday!', 'Happy birthday to Alice, Bob, and Denise!', 'Charlie'),
  ];

  onAddMessage(message: Message) {
  this.messages.push(message);
  }

}
