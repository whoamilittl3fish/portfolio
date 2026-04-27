import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  let body: Record<string, string>;
  try {
    const ct = request.headers.get('content-type') ?? '';
    if (ct.includes('application/json')) {
      body = await request.json();
    } else {
      const fd = await request.formData();
      body = Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)]));
    }
  } catch {
    return new Response(JSON.stringify({ error: 'invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name, email, message } = body;
  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'missing fields' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { error } = await resend.emails.send({
    from: 'portfolio <noreply@zoskisk.com>',
    to: 'khoa.ngovoviet@gmail.com',
    replyTo: email,
    subject: `message from ${name}`,
    text: `from: ${name}\nemail: ${email}\n\n${message}`,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Auto-reply to client
  await resend.emails.send({
    from: 'Khoa Ngo <noreply@zoskisk.com>',
    to: email,
    subject: 'thank you for your message',
    text: `hi ${name},\n\ni've received your message and will get back to you as soon as possible.\n\nbest regards,\nkhoa ngo / zsk`,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
