import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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

    // Section pièce jointe directement dans le corps du mail
    const attachmentSection = attachmentUrl
      ? `
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-top: 20px; border: 2px solid #ffc107;">
        <h3 style="color: #856404; margin-top: 0;">📎 PIÈCE JOINTE</h3>
        <p style="margin: 10px 0; font-size: 16px;">
          <strong>Fichier:</strong> ${attachmentName || "Document joint"}
        </p>
        <p style="margin: 10px 0;">
          <a href="${attachmentUrl}" target="_blank" 
             style="display: inline-block; background: #1a365d; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; font-weight: bold;">
            ⬇️ TÉLÉCHARGER LE FICHIER
          </a>
        </p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
          Lien direct: <a href="${attachmentUrl}" style="color: #2563eb; word-break: break-all;">${attachmentUrl}</a>
        </p>
      </div>
    `
      : "";

    // Envoyer l'email à recrutement@sodistraci.com
    const emailResponse = await resend.emails.send({
      from: "SODISTRA Contact <onboarding@resend.dev>",
      to: ["recrutement@sodistraci.com"],
      reply_to: email,
      subject: emailSubject,
      text: [
        `${isApplication ? "Nouvelle candidature" : "Nouveau message de contact"}`,
        `Nom: ${name}`,
        `Email: ${email}`,
        phone ? `Téléphone: ${phone}` : null,
        `Sujet: ${subject}`,
        "",
        message,
        attachmentUrl ? "" : null,
        attachmentUrl ? `Pièce jointe à télécharger: ${attachmentUrl}` : null,
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
