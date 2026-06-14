import emailjs, { EmailJSResponseStatus } from '@emailjs/nodejs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getEmailJsConfigError, getEmailJsEnv } from './emailJsEnv';

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

  const { serviceId, templateId, publicKey, privateKey } = getEmailJsEnv();
  const configError = getEmailJsConfigError({ serviceId, templateId, publicKey, privateKey });

  if (configError || !serviceId || !templateId || !publicKey) {
    return NextResponse.json({ error: configError ?? 'メール送信の設定が未完了です。' }, { status: 503 });
  }

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        from_name: name,
        from_email: email,
        subject,
        message,
      },
      {
        publicKey,
        ...(privateKey ? { privateKey } : {}),
      },
    );
  } catch (error) {
    if (error instanceof EmailJSResponseStatus) {
      console.error('[contact] EmailJS error:', error.status, error.text);

      if (error.status === 403 && error.text.includes('Private Key')) {
        return NextResponse.json(
          { error: 'メール送信の設定が未完了です（Private Key が未設定または無効）。' },
          { status: 503 },
        );
      }

      return NextResponse.json(
        { error: '送信に失敗しました。時間をおいて再度お試しください。' },
        { status: 500 },
      );
    }

    console.error('[contact] Unexpected error:', error);
    return NextResponse.json(
      { error: '送信に失敗しました。時間をおいて再度お試しください。' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
