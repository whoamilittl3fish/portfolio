import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '1 d'),
  prefix: 'contact',
});

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

  const { name, email, message, website, 'cf-turnstile-response': turnstileToken } = body;

  // Honeypot check
  if (website) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Cloudflare Turnstile Verification
  if (!turnstileToken) {
    return new Response(JSON.stringify({ error: 'Please complete the security check.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${import.meta.env.TURNSTILE_SECRET_KEY}&response=${turnstileToken}`,
  });

  const verifyData = await verifyResponse.json();
  if (!verifyData.success) {
    return new Response(JSON.stringify({ error: 'Security check failed. Please try again.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return new Response(JSON.stringify({ error: 'Too many messages today. Try again tomorrow.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'missing fields' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { error } = await resend.emails.send({
    from: 'portfolio <noreply@zoskisk.com>',
    to: 'contact@zoskisk.com',
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
  const hour = (new Date().getUTCHours() + 7) % 24;
  let greeting = 'Hi';
  if (hour >= 5 && hour < 12) greeting = 'Good morning';
  else if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
  else greeting = 'Good evening';

  await resend.emails.send({
    from: 'Khoa Ngo <noreply@zoskisk.com>',
    to: email,
    subject: 'Thank You for Your Message',
    text: `${greeting} ${name},\n\nI've received your message and will get back to you as soon as possible.\n\nBest regards,\nKhoa Ngo / ZSK`,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
