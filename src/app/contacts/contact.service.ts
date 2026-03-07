import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService implements OnInit {
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  contactSelectedEvent = new EventEmitter<Contact>();
  contacts: Contact[] = [];

  constructor(private http: HttpClient) {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
   }

  ngOnInit() {
  }

  getContacts(): Contact[] {
    this.http.get<Contact[]>("https://cms-wdd430-524df-default-rtdb.firebaseio.com/contacts.json").subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        this.contactListChangedEvent.next(this.contacts.slice());
        this.contacts.slice();
      },
      (error: any) => {
        console.error('Error fetching contacts:', error);
      }
    );
    return this.contacts.slice();
  }

  getContact(id: string): Contact {
    return this.contacts.find(contact => contact.id === id)!;
  }

  getMaxId(): number {
    let maxId = 0;
    for (const con of this.contacts) {
      const currentId = parseInt(con.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    const contactsListClone = this.contacts.slice();
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    const contactsListClone = this.contacts.slice();
    this.storeContacts();
  }
  
  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    const contactsListClone = this.contacts.slice();
    this.storeContacts();
  }

  storeContacts() {
    const contacts = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.http.put("https://cms-wdd430-524df-default-rtdb.firebaseio.com/contacts.json", contacts, { headers }).subscribe(
      () => {
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.error('Error storing contacts:', error);
      }
    );
  }
}
