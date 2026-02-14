import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contacts: Contact[] = [];

  constructor() {
    this.contacts = MOCKCONTACTS;
   }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact {
    return this.contacts.find(contact => contact.id === id)!;
  }

  deleteContact(contact: Contact) {
    console.log('deleteContact called with:', contact);
    
    if (!contact) {
      console.error('Cannot delete: contact is null or undefined');
      return;
    }

    const pos = this.contacts.indexOf(contact);
    console.log('Contact position in array:', pos);
    
    if (pos < 0) {
      console.error('Contact not found in array');
      return;
    }
    
    this.contacts.splice(pos, 1);
    console.log('Contact deleted. Remaining contacts:', this.contacts.length);
    this.contactChangedEvent.emit(this.contacts.slice());
  }
}
