const PLACEHOLDER_PATTERN = /^your_/i;

function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value && !PLACEHOLDER_PATTERN.test(value)) {
      return value;
    }
  }

  return undefined;
}

export function getEmailJsEnv() {
  return {
    serviceId: readEnv('EMAILJS_SERVICE_ID', 'NEXT_PUBLIC_EMAILJS_SERVICE_ID'),
    templateId: readEnv('EMAILJS_TEMPLATE_ID', 'NEXT_PUBLIC_EMAILJS_TEMPLATE_ID'),
    publicKey: readEnv('EMAILJS_PUBLIC_KEY', 'NEXT_PUBLIC_EMAILJS_PUBLIC_KEY'),
    privateKey: readEnv('EMAILJS_PRIVATE_KEY'),
  };
}

export function getEmailJsConfigError(config: ReturnType<typeof getEmailJsEnv>): string | null {
  if (!config.serviceId || !config.templateId || !config.publicKey) {
    return 'メール送信の設定が未完了です。管理者にお問い合わせください。';
  }

  return null;
}
