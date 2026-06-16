import { validationResult } from 'express-validator';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../utils/asyncHandler.js';
import crypto from 'crypto';
import sendEmail, { formatEmailError } from '../utils/sendEmail.js';

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    data: {
      user: formatUser(user),
      token,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    data: {
      user: formatUser(user),
      token,
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: formatUser(req.user),
    },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, password } = req.body;

  if (name !== undefined) {
    user.name = name;
  }

  if (password) {
    user.password = password;
  }

  await user.save();

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    data: {
      user: formatUser(user),
      token,
    },
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always respond with success to prevent account enumeration.
  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'If an account exists for this email, a reset link has been sent.',
      hint: "If you don't see the email, check your spam or junk folder.",
    });
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl.replace(/\/$/, '')}/reset-password?token=${rawToken}`;

  const subject = 'Reset your DOIT password';
  const text = `You requested a password reset for your DOIT account.\n\nReset your password using this link (valid for 1 hour):\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`;
  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; line-height: 1.5;">
      <h2 style="margin:0 0 12px;">Reset your DOIT password</h2>
      <p style="margin:0 0 12px;">You requested a password reset for your DOIT account.</p>
      <p style="margin:0 0 16px;">
        <a href="${resetUrl}" style="display:inline-block;padding:10px 14px;background:#2563eb;color:white;text-decoration:none;border-radius:10px;">
          Reset password
        </a>
      </p>
      <p style="margin:0 0 12px;color:#475569;">This link is valid for 1 hour. If you didn't request this, you can ignore this email.</p>
      <p style="margin:0;color:#64748b;font-size:12px;">If the button doesn't work, copy and paste this URL:</p>
      <p style="margin:6px 0 0;color:#0f172a;font-size:12px;word-break:break-all;">${resetUrl}</p>
    </div>
  `;

  try {
    await sendEmail({ to: user.email, subject, text, html });
  } catch (err) {
    // If email fails, clear token so links aren't left hanging.
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    if (process.env.NODE_ENV === 'development') {
      console.error('Forgot password email error:', err.message);
    }
    res.status(500);
    throw new Error(formatEmailError(err));
  }

  return res.status(200).json({
    success: true,
    message: 'If an account exists for this email, a reset link has been sent.',
    hint: "If you don't see the email, check your spam or junk folder.",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { token, password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: new Date() },
  }).select('+resetPasswordToken +resetPasswordExpire');

  if (!user) {
    res.status(400);
    throw new Error('Reset link is invalid or has expired');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successful. Please sign in with your new password.',
  });
});
