import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";

const NOTIFY_EMAILS = ["aniketbhalerao065@gmail.com", "support.neoluxetrust@gmail.com"];

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(10).max(5000),
});

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendSingleResendEmail(
  apiKey: string,
  from: string,
  to: string,
  data: z.infer<typeof contactSchema>,
): Promise<boolean> {
  const topic = data.subject?.trim() || "General Inquiry";
  const istTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const subjectLine = `[ToolNami Contact] ${topic} — from ${data.name}`;
  const textBody = [
    `New Contact Message on ToolNami`,
    `----------------------------------------`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Topic: ${topic}`,
    `Time (IST): ${istTime}`,
    `----------------------------------------`,
    `Message:`,
    data.message,
  ].join("\n");

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 24px 28px; color: #ffffff;">
        <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">ToolNami • LuminaLM Official</p>
        <h2 style="margin: 6px 0 0; font-size: 20px; font-weight: 700;">New Contact Message Received</h2>
      </div>
      <div style="padding: 28px; color: #0f172a;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 110px; font-weight: 600;">Sender Name:</td>
            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${escapeHtml(data.name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Sender Email:</td>
            <td style="padding: 8px 0;">
              <a href="mailto:${escapeHtml(data.email)}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${escapeHtml(data.email)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Subject / Topic:</td>
            <td style="padding: 8px 0; color: #0f172a;">${escapeHtml(topic)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Received (IST):</td>
            <td style="padding: 8px 0; color: #475569;">${escapeHtml(istTime)}</td>
          </tr>
        </table>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-top: 12px;">
          <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Message Content</p>
          <div style="font-size: 15px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${escapeHtml(data.message).replaceAll("\n", "<br />")}</div>
        </div>

        <div style="margin-top: 24px;">
          <a href="mailto:${escapeHtml(data.email)}?subject=${encodeURIComponent(`Re: ${topic} — ToolNami`)}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 20px; border-radius: 10px;">
            Reply Directly to ${escapeHtml(data.name)}
          </a>
        </div>
      </div>
      <div style="background-color: #f8fafc; padding: 14px 28px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
        Sent via ToolNami Contact Form (toolnami.com)
      </div>
    </div>
  `;

  const payload = JSON.stringify({
    from,
    to: [to],
    reply_to: data.email,
    subject: subjectLine,
    text: textBody,
    html: htmlBody,
  });

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: payload,
      });

      if (response.ok) {
        return true;
      }

      if (response.status === 429 && attempt === 0) {
        await sleep(800);
        continue;
      }

      const errorBody = await response.text();
      console.error(`Resend request to ${to} failed [${response.status}]: ${errorBody}`);
      return false;
    } catch (err) {
      console.error(`Resend network error to ${to}:`, err);
      return false;
    }
  }

  return false;
}

async function sendNotificationEmail(data: z.infer<typeof contactSchema>) {
  const rawKey =
    process.env["RESEND_API_KEY"] ||
    process.env["VITE_RESEND_API_KEY"] ||
    process.env["RESEND_KEY"] ||
    "";
  const resendApiKey = rawKey.trim().replace(/^['"]|['"]$/g, "");

  if (!resendApiKey) {
    console.error("RESEND_API_KEY is not configured");
    return { emailed: false as const, reason: "missing_api_key" as const };
  }

  const fromEmail =
    process.env["RESEND_FROM_EMAIL"]?.trim() || "ToolNami Contact <onboarding@resend.dev>";

  // Send sequentially to avoid Resend's 2 req/sec rate limit on free tier
  // and ensure the primary owner email (aniketbhalerao065@gmail.com) is delivered first.
  let anySent = false;
  for (let i = 0; i < NOTIFY_EMAILS.length; i++) {
    const to = NOTIFY_EMAILS[i];
    if (i > 0) {
      await sleep(600);
    }
    const ok = await sendSingleResendEmail(resendApiKey, fromEmail, to, data);
    if (ok) {
      anySent = true;
    }
  }

  return {
    emailed: anySent,
    reason: anySent ? undefined : ("resend_rejected" as const),
  };
}

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const supabaseUrl = process.env["SUPABASE_URL"];
    const supabaseKey = process.env["SUPABASE_PUBLISHABLE_KEY"];

    let savedToDb = false;
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });

        const formattedMessage = data.subject
          ? `[Topic: ${data.subject}] ${data.message}`
          : data.message;

        const { error } = await supabase.from("contact_messages").insert({
          name: data.name,
          email: data.email,
          message: formattedMessage,
        });
        if (error) {
          console.error(`Contact insert failed: ${error.message}`);
        } else {
          savedToDb = true;
        }
      } catch (err) {
        console.error("Supabase contact insert error:", err);
      }
    }

    const { emailed, reason } = await sendNotificationEmail(data);
    return { ok: true as const, emailed, savedToDb, reason };
  });
