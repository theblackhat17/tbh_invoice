// src/routes/api/invoices/[id]/+server.ts
import db from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;
  try {
    const stmt = db.prepare(`SELECT * FROM invoices WHERE id = ?`);
    const invoice = stmt.get(id);
    return json(invoice);
  } catch (error) {
    return json({ success: false, message: 'Erreur lors de la récupération de la facture' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  const { id } = params;
  try {
    const stmt = db.prepare(`DELETE FROM invoices WHERE id = ?`);
    stmt.run(id);
    return json({ success: true });
  } catch (error) {
    return json({ success: false, message: 'Erreur lors de la suppression de la facture' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  const { id } = params;
  const data = await request.json();
  const { invoice_number, invoice_date, client_name, client_address, items } = data;
  try {
    const stmt = db.prepare(`
      UPDATE invoices
      SET invoice_number = ?, invoice_date = ?, client_name = ?, client_address = ?, items = ?
      WHERE id = ?
    `);
    stmt.run(invoice_number, invoice_date, client_name, client_address, JSON.stringify(items), id);
    return json({ success: true });
  } catch (error) {
    return json({ success: false, message: 'Erreur lors de la mise à jour de la facture' }, { status: 500 });
  }
};
