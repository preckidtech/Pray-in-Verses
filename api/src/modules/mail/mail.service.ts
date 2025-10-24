import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as SendGridNS from '@sendgrid/mail'; // safe namespace import

// ✅ normalize ESM/CommonJS import shapes
const sgMail: typeof SendGridNS & { default?: any } =
  (SendGridNS as any)?.default ? (SendGridNS as any).default : (SendGridNS as any);

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
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
  // ... keep the rest of the class as you had it ...
    async sendInvite(to: string, link: string, role: string) {
    const from = process.env.MAIL_FROM || 'Pray in Verses <no-reply@prayinverses.com>';
    const subject = 'Your Pray in Verses invite';
    const html = `
      <p>You’ve been invited to join <b>Pray in Verses</b> as <b>${role}</b>.</p>
      <p>Click to accept your invite:</p>
      <p><a href="${link}">${link}</a></p>
      <p>This link will expire soon.</p>
    `;
    const text = `You’ve been invited as ${role}.\nAccept your invite: ${link}\n`;

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

    const tx = this.transporter();
    if (!tx) {
      this.logger.log(`[INVITE email] (dev fallback) to=${to} link=${link} role=${role}`);
      return;
    }

    this.logger.log(`Sending invite via SMTP → from=${from} to=${to}`);
    await this.transporter.sendMail({ from, to, subject, text, html });
  }
}
