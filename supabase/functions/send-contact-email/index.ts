import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { encode as encodeBase64 } from "https://deno.land/std@0.190.0/encoding/base64.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type?: "contact" | "candidature";
  attachmentUrl?: string;
  attachmentName?: string;
}

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_ATTACHMENT_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

const safeAttachmentFilename = (name?: string) => {
  const fallback = "piece-jointe";
  const raw = (name ?? fallback).trim();
  const cleaned = raw.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 120);
  return cleaned.length ? cleaned : fallback;
};

const filenameWithBestEffortExtension = (baseName: string, contentType: string) => {
  // If the filename already has an extension, keep it.
  if (/[.][a-zA-Z0-9]{2,6}$/.test(baseName)) return baseName;

  const ext =
    contentType === "application/pdf"
      ? ".pdf"
      : contentType === "image/jpeg"
        ? ".jpg"
        : contentType === "image/png"
          ? ".png"
          : "";

  return `${baseName}${ext}`;
};

const buildResendAttachments = async (
  attachmentUrl?: string,
  attachmentName?: string
): Promise<{ filename: string; content: string }[] | undefined> => {
  if (!attachmentUrl) return undefined;

  // IMPORTANT: Resend n'attache pas un fichier depuis une URL via "path".
  // On récupère le fichier et on l'envoie en base64 pour qu'il soit vraiment en PJ.
  const res = await fetch(attachmentUrl);
  if (!res.ok) {
    throw new Error(`Impossible de télécharger la pièce jointe (HTTP ${res.status}).`);
  }

  const contentType = (res.headers.get("content-type") ?? "").split(";")[0].trim();
  if (!ALLOWED_ATTACHMENT_MIME.has(contentType)) {
    throw new Error(
      `Type de fichier non autorisé (${contentType || "inconnu"}). Autorisés: PDF, JPG, PNG.`
    );
  }

  const bytes = new Uint8Array(await res.arrayBuffer());
  if (bytes.byteLength > MAX_ATTACHMENT_BYTES) {
    throw new Error(
      `Pièce jointe trop volumineuse (${Math.ceil(bytes.byteLength / 1024 / 1024)}MB). Max 5MB.`
    );
  }

  const baseFilename = safeAttachmentFilename(attachmentName);
  const filename = filenameWithBestEffortExtension(baseFilename, contentType);

  console.log("Attachment fetched:", { contentType, bytes: bytes.byteLength, filename });

  return [
    {
      filename,
      content: encodeBase64(bytes.buffer),
    },
  ];
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      type = "contact",
      attachmentUrl,
      attachmentName,
    }: ContactRequest = await req.json();

    console.log("Sending email for:", { name, email, subject, type, attachmentUrl });

    const isApplication = type === "candidature" || subject.includes("Candidature");
    const emailSubject = isApplication ? `[Candidature] ${subject}` : `[Contact Site Web] ${subject}`;

    // Section pièce jointe (dans le HTML, en plus d'être jointe)
    const attachmentSection = attachmentUrl
      ? `
      <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <h3 style="color: #1a365d; margin-top: 0;">📎 Pièce jointe:</h3>
        <p style="margin: 0;">
          <a href="${attachmentUrl}" target="_blank" style="color: #2563eb; text-decoration: underline;">
            ${attachmentName || "Télécharger le fichier"}
          </a>
        </p>
      </div>
    `
      : "";

    const attachments = await buildResendAttachments(attachmentUrl, attachmentName);

    // Envoyer l'email à recrutement@sodistraci.com (utilise le domaine Resend par défaut)
    const emailResponse = await resend.emails.send({
      from: "SODISTRA Contact <onboarding@resend.dev>",
      to: ["recrutement@sodistraci.com"],
      reply_to: email,
      subject: emailSubject,
      // Ajout d'un texte brut pour améliorer la délivrabilité
      text: [
        `${isApplication ? "Nouvelle candidature" : "Nouveau message de contact"}`,
        `Nom: ${name}`,
        `Email: ${email}`,
        phone ? `Téléphone: ${phone}` : null,
        `Sujet: ${subject}`,
        "",
        message,
        attachmentUrl ? "" : null,
        attachmentUrl ? `Pièce jointe: ${attachmentUrl}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">SODISTRA</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">${
              isApplication ? "Nouvelle candidature" : "Nouveau message de contact"
            }</p>
          </div>
          
          <div style="padding: 30px; background: #f7f7f7;">
            <h2 style="color: #1a365d; margin-top: 0;">${
              isApplication ? "Détails de la candidature" : "Détails du message"
            }</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0 0 10px 0;"><strong>Nom:</strong> ${name}</p>
              <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              ${phone ? `<p style="margin: 0 0 10px 0;"><strong>Téléphone:</strong> ${phone}</p>` : ""}
              <p style="margin: 0;"><strong>Sujet:</strong> ${subject}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #1a365d; margin-top: 0;">Message:</h3>
              <p style="white-space: pre-wrap; margin: 0;">${message.replace(/\n/g, "<br>")}</p>
            </div>
            
            ${attachmentSection}
          </div>
          
          <div style="padding: 15px; background: #e2e8f0; text-align: center; font-size: 12px; color: #666;">
            <p style="margin: 0;">Ce message a été envoyé depuis le site web SODISTRA.</p>
            <p style="margin: 5px 0 0 0;">Vous pouvez répondre directement à cet email pour contacter l'expéditeur.</p>
          </div>
        </div>
      `,
      // ✅ PJ réelle (base64)
      attachments: attachments,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
