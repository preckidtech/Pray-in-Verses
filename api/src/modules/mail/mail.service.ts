import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as SendGridNS from '@sendgrid/mail'; // safe namespace import

// ✅ Normalize ESM/CommonJS import shapes for SendGrid
const sgMail: typeof SendGridNS & { default?: any } =
  (SendGridNS as any)?.default ? (SendGridNS as any).default : (SendGridNS as any);

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  private transport: nodemailer.Transporter | null = null;
  private usingSendgrid = false;

  constructor() {
    const sgKey = process.env.SENDGRID_API_KEY;
    if (sgKey) {
      try {
        sgMail.setApiKey(sgKey);
        this.usingSendgrid = true;
        this.logger.log(`MailService: using SendGrid Web API`);
      } catch (e: any) {
        this.logger.error(`SendGrid init failed: ${e?.message || e}`);
        this.usingSendgrid = false; // fall back to SMTP if configured
      }
    }
  }

  /** Lazily build (and cache) a nodemailer transport if SMTP is configured */
  private getTransporter(): nodemailer.Transporter | null {
    if (this.transport) return this.transport;

    const url = process.env.SMTP_URL;
    if (url) {
      this.transport = nodemailer.createTransport(url);
      this.logger.log(`MailService: using SMTP (URL)`);
      return this.transport;
    }

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && port) {
      this.transport = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // common secure port
        auth: user && pass ? { user, pass } : undefined,
      });
      this.logger.log(`MailService: using SMTP (HOST/PORT)`);
      return this.transport;
    }

    // No SMTP configured
    return null;
  }

  /** Shared sender identity */
  private fromAddress() {
    return process.env.MAIL_FROM || 'Pray in Verses <no-reply@prayinverses.com>';
  }

  /** Invite email (kept from your original API) */
  async sendInvite(to: string, link: string, role: string) {
    const from = this.fromAddress();
    const subject = 'Your Pray in Verses invite';
    const html = `
      <p>You’ve been invited to join <b>Pray in Verses</b> as <b>${role}</b>.</p>
      <p>Click to accept your invite:</p>
      <p><a href="${link}">${link}</a></p>
      <p>This link will expire soon.</p>
    `;
    const text = `You’ve been invited as ${role}.\nAccept your invite: ${link}\n`;

    // Prefer SendGrid
    if (this.usingSendgrid) {
      try {
        await sgMail.send({ to, from, subject, text, html });
        this.logger.log(`SendGrid: invite email sent → to=${to}`);
        return;
      } catch (e: any) {
        this.logger.error(`SendGrid send failed: ${e?.message || e}`);
        if (e?.response?.body) {
          this.logger.error(`SendGrid response body: ${JSON.stringify(e.response.body)}`);
        }
        // fall through to SMTP if present
      }
    }

    // SMTP fallback
    const tx = this.getTransporter();
    if (tx) {
      this.logger.log(`Sending invite via SMTP → from=${from} to=${to}`);
      await tx.sendMail({ from, to, subject, text, html });
      return;
    }

    // Dev fallback (no provider configured)
    this.logger.log(`[INVITE email] (dev fallback) to=${to} link=${link} role=${role}`);
  }

  /** ✅ New: Password reset email used by AuthService.createPasswordReset */
  async sendPasswordReset(to: string, link: string) {
    const from = this.fromAddress();
    const subject = 'Reset your Pray in Verses password';
    const html = `
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the link below to set a new one:</p>
      <p><a href="${link}">Reset Password</a></p>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    `;
    const text = `Reset your password:\n${link}\n`;

    // Prefer SendGrid
    if (this.usingSendgrid) {
      try {
        await sgMail.send({ to, from, subject, text, html });
        this.logger.log(`SendGrid: password reset sent → to=${to}`);
        return;
      } catch (e: any) {
        this.logger.error(`SendGrid send failed: ${e?.message || e}`);
        if (e?.response?.body) {
          this.logger.error(`SendGrid response body: ${JSON.stringify(e.response.body)}`);
        }
        // fall through to SMTP if present
      }
    }

    // SMTP fallback
    const tx = this.getTransporter();
    if (tx) {
      this.logger.log(`Sending password reset via SMTP → from=${from} to=${to}`);
      await tx.sendMail({ from, to, subject, text, html });
      return;
    }

    // Dev fallback (no provider configured)
    this.logger.log(`[RESET email] (dev fallback) to=${to} link=${link}`);
  }
}
