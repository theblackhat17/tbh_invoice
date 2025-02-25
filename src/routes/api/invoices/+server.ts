// src/routes/api/invoices/+server.ts
import db from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const { invoice_number, invoice_date, client_name, client_address, items } = data;
  const stmt = db.prepare(`
    INSERT INTO invoices (invoice_number, invoice_date, client_name, client_address, items)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(invoice_number, invoice_date, client_name, client_address, JSON.stringify(items));
  return json({ success: true, id: info.lastInsertRowid });
};

export const GET: RequestHandler = async () => {
  const rows = db.prepare(`SELECT * FROM invoices ORDER BY created_at DESC`).all();
  return json(rows);
};
