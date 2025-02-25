// src/routes/api/clients/[id]/+server.ts
import db from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;
  const client = db.prepare(`SELECT * FROM clients WHERE id = ?`).get(id);
  return json(client);
};

export const PUT: RequestHandler = async ({ params, request }) => {
  const { id } = params;
  const { name, address, phone, code_postal, city, country } = await request.json();
  const stmt = db.prepare(`
    UPDATE clients
    SET name = ?, address = ?, phone = ?, code_postal = ?, city = ?, country = ?
    WHERE id = ?
  `);
  stmt.run(name, address, phone, code_postal, city, country, id);
  return json({ success: true });
};

export const DELETE: RequestHandler = async ({ params }) => {
  const { id } = params;
  const stmt = db.prepare(`DELETE FROM clients WHERE id = ?`);
  stmt.run(id);
  return json({ success: true });
};
