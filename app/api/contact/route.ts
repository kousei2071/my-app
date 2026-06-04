import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, '名前を入力してください').max(100),
  email: z.string().trim().email('有効なメールアドレスを入力してください').max(254),
  subject: z.string().trim().min(1, '件名を入力してください').max(200),
  message: z.string().trim().min(1, '本文を入力してください').max(5000),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? '入力内容を確認してください';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { name, email, subject, message, website } = parsed.data;

  if (website) {
    return NextResponse.json({ ok: true });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!resendApiKey || !toEmail || !fromEmail) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 503 });
  }

  const resend = new Resend(resendApiKey);
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: email,
    subject: `[Portfolio Contact] ${subject}`,
    text: [`From: ${name} <${email}>`, '', message].join('\n'),
  });

  if (error) {
    console.error('[contact] Resend error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
