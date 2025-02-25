// src/routes/api/clients/+server.ts
import db from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const clients = db.prepare(`SELECT * FROM clients ORDER BY created_at DESC`).all();
  return json(clients);
};

export const POST: RequestHandler = async ({ request }) => {
  const { name, address, phone, code_postal, city, country } = await request.json();
  const stmt = db.prepare(`
    INSERT INTO clients (name, address, phone, code_postal, city, country)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(name, address, phone, code_postal, city, country);
  return json({ success: true, id: info.lastInsertRowid });
};
