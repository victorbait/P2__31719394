import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

interface Contact {
  email: string;
  name: string;
  comment: string;
  ip: string;
  created_at: string;
}

class ContactsModel {
  static async add(contact: Contact) {
    const db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });

await db.run(
  'CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, name TEXT, comment TEXT, ip TEXT, created_at TEXT)'
);

    await db.run(
      'INSERT INTO contacts (email, name, comment, ip, created_at) VALUES (?, ?, ?, ?, ?)',
      contact.email,
      contact.name,
      contact.comment,
      contact.ip,
      contact.created_at
    );

    await db.close();
  }

  static async getAll() {
    const db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });

    const contacts = await db.all('SELECT * FROM contacts');

    await db.close();

    return contacts;
  }
}

export default ContactsModel;
