// src/lib/db.ts
import Database from 'better-sqlite3';

const db = new Database('invoices.db', { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT,
    invoice_date TEXT,
    client_name TEXT,
    client_address TEXT,
    items TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
