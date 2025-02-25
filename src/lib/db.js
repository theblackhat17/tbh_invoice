// src/lib/db.js
import Database from 'better-sqlite3';

const db = new Database('invoices.db');

// Crée la table des factures si elle n'existe pas
db.exec(`
  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT,
    invoice_date TEXT,
    client_name TEXT,
    client_address TEXT,
    items TEXT, -- Stocké au format JSON
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
