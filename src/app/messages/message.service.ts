import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];
  maxMessageId: number;

  constructor(private http: HttpClient) {
    this.messages = MOCKMESSAGES;
    this.maxMessageId = this.getMaxId();
  }

  getMessages(): Message[] {
    this.http.get<Message[]>("https://cms-wdd430-524df-default-rtdb.firebaseio.com/messages.json").subscribe(
      (messages: Message[]) => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        this.messageChangedEvent.next(this.messages.slice());
        this.messages.slice();
      },
      (error: any) => {
        console.error('Error fetching messages:', error);
      }
    );
    return this.messages.slice();
  }

  getMessage(id: string): Message {
    return this.messages.find(message => message.id === id)!;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages();
  }

  getMaxId(): number {
    let maxId = 0;
    for (const m of this.messages) {
      const currentId = parseInt(m.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  storeMessages() {
    const messages = JSON.stringify(this.messages);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.http.put('https://cms-wdd430-524df-default-rtdb.firebaseio.com/messages.json', messages, { headers: headers })
      .subscribe(() => {
        this.messageChangedEvent.emit(this.messages.slice());
      }, (error) => {
        console.error('Error storing messages:', error);
      });
  }
}
