import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';


async function createDatabase() {
  const db = await open({
    filename: path.resolve(__dirname, '../../database.sqlite'),
    driver: sqlite3.Database
  });

  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      comment TEXT NOT NULL,
      ip TEXT NOT NULL,
      country TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Base de datos y tabla "contacts" creadas correctamente.');
  await db.close();
}


createDatabase().catch((err) => {
  console.error('❌ Error creando la base de datos:', err);
});
