import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService implements OnInit {
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  documentSelectedEvent = new EventEmitter<Document>();  
  documents: Document[] = [];

  constructor(private http: HttpClient) { 
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  ngOnInit() {
  }

  getDocuments(): Document[] {
    this.http.get<Document[]>("https://cms-wdd430-524df-default-rtdb.firebaseio.com/documents.json").subscribe(
      (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        this.documentListChangedEvent.next(this.documents.slice());
        this.documents.slice();
      },
      (error: any) => {
        console.error('Error fetching documents:', error);
      }
    );
    return this.documents.slice();
  }

  getDocument(id: string): Document {
    return this.documents.find(doc => doc.id === id)!;
  }

  getMaxId(): number {
    let maxId = 0;
    for (const doc of this.documents) {
      const currentId = parseInt(doc.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument)
    const documentsListClone = this.documents.slice();
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    const documentsListClone = this.documents.slice();
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    const documentsListClone = this.documents.slice();
    this.storeDocuments();
  }

  storeDocuments() {
    const documents = JSON.stringify(this.documents);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.http.put("https://cms-wdd430-524df-default-rtdb.firebaseio.com/documents.json", documents, { headers }).subscribe(
      () => {
        this.documentListChangedEvent.next(this.documents.slice());
      },
      (error: any) => {
        console.error('Error storing documents:', error);
      }
    );
  }
}
