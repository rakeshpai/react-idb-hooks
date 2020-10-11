import Dexie from 'dexie';
import 'dexie-observable';

// This DB definition is from https://dexie.org/docs/Typescript

export type Contact = {
  id?: number; // Primary key. Optional (autoincremented)
  first: string; // First name
  last: string; // Last name
}

export type EmailAddress = {
  id?: number;
  contactId: number; // "Foreign key" to an IContact
  type: string; // Type of email such as "work", "home" etc...
  email: string; // The email address
}

export type PhoneNumber = {
  id?: number;
  contactId: number;
  type: string;
  phone: string;
}

export class MyAppDatabase extends Dexie {
  contacts: Dexie.Table<Contact, number>;
  emails: Dexie.Table<EmailAddress, number>;
  phones: Dexie.Table<PhoneNumber, number>;
  
  constructor() {  
    super("MyAppDatabase");
    
    //
    // Define tables and indexes
    // (Here's where the implicit table props are dynamically created)
    //
    this.version(1).stores({
      contacts: '++id, first, last',
      emails: '++id, contactId, type, email',
      phones: '++id, contactId, type, phone',
    });
    
    // The following lines are needed for it to work across typescipt using babel-preset-typescript:
    this.contacts = this.table("contacts");
    this.emails = this.table("emails");
    this.phones = this.table("phones");
  }
};

export const createDB = () => new MyAppDatabase();

export const clearDB = (db: MyAppDatabase) =>
  db.delete();

export const dbData = {
  contacts: [
    { id: 1, first: 'John', last: 'Doe' },
    { id: 2, first: 'Alice', last: 'Bob' },
    { id: 3, first: 'Chuck', last: 'Norris' }
  ],
  emails: [
    { id: 1, contactId: 1, email: 'john.doe@example.com', type: 'personal' },
    { id: 2, contactId: 2, email: 'alice@example.com', type: 'work' },
  ],
  phones: [
    { id: 1, contactId: 1, type: 'mobile', phone: '123123' },
    { id: 2, contactId: 3, type: 'home', phone: '456456' }
  ]
}

export const populateDB = (db: MyAppDatabase) =>
  db.transaction('rw', db.contacts, db.emails, db.phones, () => {
    return Promise.all([
      db.contacts.bulkAdd(dbData.contacts),
      db.emails.bulkAdd(dbData.emails),
      db.phones.bulkAdd(dbData.phones)
    ]);
  });
