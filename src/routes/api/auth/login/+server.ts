// src/routes/api/auth/login/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { auth } from '$lib/auth';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const { email, password } = await request.json();
  try {
    await auth.validateKeyAndPassword('email', email, password);
    // Gérer la création de session ici (par exemple, setSession, etc.)
    return json({ success: true });
  } catch (err: any) {
    return json({ success: false, message: err.message }, { status: 400 });
  }
};
