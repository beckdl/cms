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
  server = "http://localhost:3000/messages";

  constructor(private http: HttpClient) {
    this.messages = MOCKMESSAGES;
    this.maxMessageId = this.getMaxId();
  }

  getMessages(): Message[] {
    this.http.get<any[]>(this.server).subscribe(
      (messages: any[]) => {
        this.messages = messages.map((message) => this.normalizeMessage(message));
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
    if (!message) {
      return;
    }
    message.id = "";

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.http.post<{ message: string, newMessage: Message}>(this.server, message, { headers: headers })
      .subscribe((response) => {
        const newMessage = this.normalizeMessage(response.newMessage);
        this.messages.push(newMessage);
        this.messageChangedEvent.emit(this.messages.slice());
      }, (error) => {
        console.error('Error adding message:', error);
      });
  }

  private normalizeMessage(message: any): Message {
    const normalizedId = message?.id ?? message?._id ?? '';
    const rawSender = message?.sender;
    const normalizedSender = typeof rawSender === 'object'
      ? (rawSender?.id ?? rawSender?._id ?? '')
      : (rawSender ?? '');

    return new Message(
      String(normalizedId),
      message?.subject ?? '',
      message?.msgText ?? '',
      String(normalizedSender)
    );
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
    this.http.put(`${this.server}.json`, messages, { headers: headers })
      .subscribe(() => {
        this.messageChangedEvent.emit(this.messages.slice());
      }, (error) => {
        console.error('Error storing messages:', error);
      });
  }
}
