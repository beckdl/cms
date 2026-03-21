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

  server = "http://localhost:3000/documents";

  documentSelectedEvent = new EventEmitter<Document>();  
  documents: Document[] = [];

  constructor(private http: HttpClient) { 
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  ngOnInit() {
  }

  getDocuments(): Document[] {
    this.http.get<Document[]>(this.server).subscribe(
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

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    document.id = '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.http.post<{ message: string, document: Document }>(this.server, document, { headers: headers })
      .subscribe(
        (responseData) => {
          this.documents.push(responseData.document);
          this.documentListChangedEvent.next(this.documents.slice());
        }
      );
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.http.put(`${this.server}/${originalDocument.id}`, newDocument, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.documents[pos] = newDocument;
          this.documentListChangedEvent.next(this.documents.slice());
        }
      );
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.http.delete(`${this.server}/${document.id}`).subscribe(
      (response: Response) => {
        this.documents.splice(pos, 1);
        this.documentListChangedEvent.next(this.documents.slice());
      }
    );
  }

  
}
