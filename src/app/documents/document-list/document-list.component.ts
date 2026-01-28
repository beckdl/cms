import { Component, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  
  documents = [
    { id: '1', name: 'Document 1', description: 'First document', url: 'http://example.com/doc1' },
    { id: '2', name: 'Document 2', description: 'Second document', url: 'http://example.com/doc2' },
    { id: '3', name: 'Document 3', description: 'Third document', url: 'http://example.com/doc3' },
    { id: '4', name: 'Document 4', description: 'Fourth document', url: 'http://example.com/doc4' },
    { id: '5', name: 'Document 5', description: 'Fifth document', url: 'http://example.com/doc5' }
  ]

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
