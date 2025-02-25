// src/routes/api/invoices/+server.js
import db from '$lib/db';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  const data = await request.json();
  const { invoice_number, invoice_date, client_name, client_address, items } = data;

  // Insertion dans la base (les items sont encodés en JSON)
  const stmt = db.prepare(`
    INSERT INTO invoices (invoice_number, invoice_date, client_name, client_address, items)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(invoice_number, invoice_date, client_name, client_address, JSON.stringify(items));

  return json({ success: true, id: info.lastInsertRowid });
}

export async function GET() {
  const rows = db.prepare(`SELECT * FROM invoices ORDER BY created_at DESC`).all();
  return json(rows);
}
