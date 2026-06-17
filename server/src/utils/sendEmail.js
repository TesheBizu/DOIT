import sgMail from '@sendgrid/mail';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export function formatEmailError(err) {
  const message = err?.message || '';

  if (message.includes('Missing required env var')) {
    return 'Email is not configured on the server. Please try again later.';
  }

  const statusCode = err?.code || err?.response?.statusCode;
  if (statusCode === 401 || statusCode === 403) {
    return 'Email service authentication failed. Check SENDGRID_API_KEY.';
  }

  const sendGridErrors = err?.response?.body?.errors;
  if (sendGridErrors?.length) {
    const detail = sendGridErrors.map((e) => e.message).join(' ');
    if (/from|sender|verified/i.test(detail)) {
      return 'Sender email is not verified in SendGrid. Verify EMAIL_FROM in your SendGrid account.';
    }
    return `Failed to send reset email. ${detail}`;
  }

  return 'Failed to send reset email. Please try again later.';
}

export default async function sendEmail({ to, subject, text, html }) {
  const apiKey = requireEnv('SENDGRID_API_KEY');
  const from = requireEnv('EMAIL_FROM');

  sgMail.setApiKey(apiKey);

  await sgMail.send({
    to,
    from,
    subject,
    text,
    html,
  });
}
