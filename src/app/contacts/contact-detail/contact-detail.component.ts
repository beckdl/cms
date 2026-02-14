import { Component, Input } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css'
})
export class ContactDetailComponent {
  contact: Contact;

  constructor(private contactService: ContactService, private router: Router, private route: ActivatedRoute) { 
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.contact = this.contactService.getContact(id);
      console.log('Loaded contact:', this.contact);
    });
  }

  onDelete() {
    console.log('Delete clicked. Contact:', this.contact);
    if (!this.contact) {
      console.error('No contact to delete');
      return;
    }
    this.contactService.deleteContact(this.contact);
    this.router.navigateByUrl('/contacts');
  }
  
}
