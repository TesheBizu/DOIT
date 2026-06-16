import nodemailer from 'nodemailer';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const NETWORK_ERROR_CODES = new Set([
  'ETIMEDOUT',
  'ECONNREFUSED',
  'ECONNRESET',
  'EHOSTUNREACH',
  'ENOTFOUND',
  'ESOCKET',
]);

export function formatEmailError(err) {
  const code = err?.code;
  const message = err?.message || '';

  if (message.includes('Missing required env var')) {
    return 'Email is not configured on the server. Please try again later.';
  }

  if (
    NETWORK_ERROR_CODES.has(code) ||
    /timed out|ECONNREFUSED|ETIMEDOUT|ECONNRESET|unable to connect/i.test(message)
  ) {
    return 'Unable to reach the email server. Your network may be blocking SMTP (ports 587/465). Try another network, disable VPN, or switch SMTP_PORT to 465 with SMTP_SECURE=true.';
  }

  if (code === 'EAUTH' || /invalid login|authentication/i.test(message)) {
    return 'Email authentication failed. Check your SMTP username and app password.';
  }

  return 'Failed to send reset email. Please try again later.';
}

export default async function sendEmail({ to, subject, text, html }) {
  const host = requireEnv('SMTP_HOST');
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465;
  const user = requireEnv('SMTP_USER');
  const pass = requireEnv('SMTP_PASS');
  const from = process.env.EMAIL_FROM || user;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
}

