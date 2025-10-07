// backend/services/emailService.js
import nodemailer from "nodemailer";

// Flexible transporter initialization:
// 1) USE_ETHEREAL=true → ephemeral inbox for testing
// 2) EMAIL_USER/EMAIL_PASS (or SMTP_* envs) → real SMTP (Gmail by default)
// 3) Fallback to stream transport that logs emails to console (no external SMTP required)

let cachedTransporter = null;

export async function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const {
    USE_ETHEREAL,
    EMAIL_USER,
    EMAIL_PASS,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
  } = process.env;

  try {
    if (String(USE_ETHEREAL).toLowerCase() === "true") {
      const testAccount = await nodemailer.createTestAccount();
      cachedTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      await cachedTransporter.verify();
      console.log("✅ Mailer ready (Ethereal test SMTP)");
      console.log(`📬 Ethereal inbox: https://ethereal.email/messages`);
      return cachedTransporter;
    }

    // Prefer explicit SMTP_* if provided, else default to Gmail service using EMAIL_USER/PASS
    if ((SMTP_HOST && SMTP_PORT) || (EMAIL_USER && EMAIL_PASS)) {
      if (SMTP_HOST && SMTP_PORT) {
        cachedTransporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: Number(SMTP_PORT),
          secure: String(SMTP_SECURE).toLowerCase() === "true",
          auth: EMAIL_USER && EMAIL_PASS ? { user: EMAIL_USER, pass: EMAIL_PASS } : undefined,
        });
      } else {
        cachedTransporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS, // should be a 16-char Gmail App Password
          },
        });
      }

      await cachedTransporter.verify();
      console.log("✅ Mailer ready (SMTP verified)");
      return cachedTransporter;
    }

    // Fallback: local stream transport (prints message to console)
    cachedTransporter = nodemailer.createTransport({
      streamTransport: true,
      newline: "unix",
      buffer: true,
    });
    console.warn(
      "⚠️ No SMTP credentials found. Using local stream transport. Set EMAIL_USER/EMAIL_PASS or USE_ETHEREAL=true to send real emails."
    );
    return cachedTransporter;
  } catch (error) {
    console.error("❌ Mailer initialization failed:", error);
    // As a last resort, provide stream transport so app doesn't crash
    cachedTransporter = nodemailer.createTransport({ streamTransport: true, newline: "unix", buffer: true });
    return cachedTransporter;
  }
}

export async function getMailerInfo() {
  const t = await getTransporter();
  const usingStream = Boolean(t.options?.streamTransport);
  const isEthereal = t.options?.host === "smtp.ethereal.email";
  const mode = usingStream ? "stream" : isEthereal ? "ethereal" : "smtp";
  return {
    mode,
    fromUser: process.env.EMAIL_USER || null,
    host: t.options?.host || t.options?.service || null,
    port: t.options?.port || null,
    secure: t.options?.secure ?? null,
  };
}

export const sendWelcomeEmail = async (user) => {
  const { firstName, lastName, email } = user;
  const subject = "Welcome to Nation Motor Spares!";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #023E8A 0%, #0056b3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Welcome to Nation Motor Spares!</h1>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #023E8A; margin-top: 0;">Hello ${firstName} ${lastName}!</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">Thank you for creating an account with Nation Motor Spares.</p>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">Your account email: <strong>${email}</strong></p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #023E8A;">
          <h3 style="color: #023E8A; margin-top: 0;">What's Next?</h3>
          <ul style="color: #333; margin:0 0 0 18px;">
            <li>Access your admin dashboard</li>
            <li>Manage inventory</li>
            <li>Track sales & deliveries</li>
            <li>View analytics & reports</li>
          </ul>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">Best regards,<br><strong>The Nation Motor Spares Team</strong></p>
      </div>
    </div>
  `;

  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: `"Nation Motor Spares" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
    });
    console.log(`✅ Welcome email sent to ${email} — MessageID: ${info.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl?.(info);
    if (previewUrl) {
      console.log(`🔎 Preview (Ethereal): ${previewUrl}`);
    }
    if (transporter.options?.streamTransport) {
      console.warn(
        "⚠️ Using stream transport (no real email sent). Provide EMAIL_USER/EMAIL_PASS or set USE_ETHEREAL=true."
      );
    }
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const base = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${base}/reset-password?token=${resetToken}`;
  const subject = "Password Reset Request - Nation Motor Spares";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #023E8A 0%, #0056b3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #023E8A; margin-top: 0;">Reset Your Password</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #023E8A 0%, #0056b3 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #666;">
          If the button doesn't work, copy and paste this link:<br>
          <a href="${resetUrl}" style="color: #023E8A;">${resetUrl}</a>
        </p>
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #856404; font-size: 14px;">
            <strong>Security Note:</strong> This link expires in 1 hour. If you didn't request this, ignore this email.
          </p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">Best regards,<br><strong>The Nation Motor Spares Team</strong></p>
      </div>
    </div>
  `;

  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: `"Nation Motor Spares" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
    });
    console.log(`✅ Password reset email sent to ${email} — MessageID: ${info.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl?.(info);
    if (previewUrl) {
      console.log(`🔎 Preview (Ethereal): ${previewUrl}`);
    }
    if (transporter.options?.streamTransport) {
      console.warn(
        "⚠️ Using stream transport (no real email sent). Provide EMAIL_USER/EMAIL_PASS or set USE_ETHEREAL=true."
      );
    }
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error);
    throw error;
  }
};