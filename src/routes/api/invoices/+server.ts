// src/routes/api/invoices/+server.ts
import db from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  // On récupère les données envoyées depuis le formulaire, à l'exception du numéro de facture
  const { invoice_date, client_name, client_address, items } = data;

  // Calcul du numéro automatique
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `${year}-${month}-`;
  // On cherche la dernière facture du mois courant
  const last = db.prepare(
    `SELECT invoice_number FROM invoices WHERE invoice_number LIKE ? ORDER BY id DESC LIMIT 1`
  ).get(prefix + '%') as { invoice_number: string } | undefined;
  let seq = 1;
  if (last) {
    const parts = last.invoice_number.split('-');
    seq = Number(parts[2]) + 1;
  }
  const invoice_number = `${prefix}${String(seq).padStart(3, '0')}`;

  // Insertion dans la BDD
  const stmt = db.prepare(`
    INSERT INTO invoices (invoice_number, invoice_date, client_name, client_address, items)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    invoice_number,
    invoice_date,
    client_name,
    client_address,
    JSON.stringify(items),
  );
  return json({ success: true, id: info.lastInsertRowid, invoice_number });
};

export const GET: RequestHandler = async () => {
  const rows = db.prepare(`SELECT * FROM invoices ORDER BY created_at DESC`).all();
  return json(rows);
};
