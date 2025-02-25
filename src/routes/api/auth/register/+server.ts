// src/routes/api/auth/register/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { auth } from '$lib/auth';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const { email, password } = await request.json();
  try {
    await auth.createUser({
      primaryKey: {
        providerId: 'email',
        providerUserId: email,
        password
      },
      attributes: { email }
    });
    return json({ success: true });
  } catch (err: any) {
    return json({ success: false, message: err.message }, { status: 400 });
  }
};
