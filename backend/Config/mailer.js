import nodemailer from 'nodemailer'
import os from 'os'

/* =========================
   SMTP CONFIG
========================= */
const hasSMTP =
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS

const transporter = hasSMTP
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : nodemailer.createTransport({ jsonTransport: true })

/* =========================
   UTILS
========================= */
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return 'localhost'
}

function maskEmail(email = '') {
  if (!email.includes('@')) return '***'

  const [name, domain] = email.split('@')
  const maskedName =
    name.length <= 2
      ? '*'.repeat(name.length)
      : name.slice(0, 2) + '*'.repeat(name.length - 2)

  const domainParts = domain.split('.')
  const maskedDomain =
    domainParts[0][0] + '*'.repeat(domainParts[0].length - 1)

  return `${maskedName}@${maskedDomain}.${domainParts.slice(1).join('.')}`
}

/* =========================
   MAIL RESET CODE
========================= */
export async function sendResetCodeMail(to, code) {
  const from = process.env.MAIL_FROM;
  const subject = '🔒 Réinitialisez votre mot de passe QuickPop';

  const text = `Votre code de réinitialisation est : ${code}. Il expire dans 10 minutes.`;

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #222; max-width:500px; margin:auto; padding:20px; border:1px solid #eee; border-radius:10px; background:#fff;">
      <h2 style="color:#ef4444; text-align:center;">Réinitialisation du mot de passe</h2>
      <p style="text-align:center;">Voici votre code temporaire pour réinitialiser votre mot de passe :</p>
      <div style="
        font-size:32px;
        font-weight:bold;
        letter-spacing:8px;
        padding:15px 20px;
        background: #fef2f2;
        color:#ef4444;
        text-align:center;
        border-radius:8px;
        margin:20px 0;
      ">
        ${code}
      </div>
      <p style="text-align:center; color:#555;">Ce code expire dans <strong>10 minutes</strong>.</p>
      <p style="font-size:12px; color:#888; text-align:center; margin-top:20px;">
        Si vous n’avez pas demandé ce code, vous pouvez ignorer cet email. 🔒
      </p>
    </div>
  `;

  const info = await transporter.sendMail({ from, to, subject, text, html });

  if (process.env.NODE_ENV !== 'production') {
    console.log('📧 reset code envoyé à', maskEmail(to));
  }
}

/* =========================
   MAIL ACCOUNT VALIDATION
========================= */
export async function sendAccountValidationMail(to, fullname) {
  const from = process.env.MAIL_FROM;
  const subject = '🎉 Bienvenue sur QuickPop !';

  const ip = getLocalIpAddress();
  const frontendPort = process.env.FRONTEND_PORT || 5173;
  const frontendUrl = process.env.FRONTEND_URL || `http://${ip}:${frontendPort}/login`;

  const text = `Bonjour ${fullname}, votre compte a été validé. Vous pouvez vous connecter ici : ${frontendUrl}`;

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #222; max-width:500px; margin:auto; padding:25px; border-radius:12px; background:#fff; border:1px solid #eee;">
      <h2 style="text-align:center; color:#ef4444;">Compte validé ✅</h2>
      <p style="text-align:center; font-size:16px;">Bonjour <strong>${fullname}</strong>,</p>
      <p style="text-align:center;">Votre compte QuickPop est maintenant actif ! Vous pouvez dès maintenant vous connecter et profiter de nos services.</p>
      <div style="text-align:center; margin:25px 0;">
        <a href="${frontendUrl}" style="background-color:#ef4444; color:#fff; padding:12px 25px; border-radius:8px; text-decoration:none; font-weight:bold; display:inline-block;">Se connecter</a>
      </div>
      <p style="text-align:center; font-size:12px; color:#888;">Si vous n’avez pas créé ce compte, ignorez simplement ce mail.</p>
    </div>
  `;

  const info = await transporter.sendMail({ from, to, subject, text, html });

  if (process.env.NODE_ENV !== 'production') {
    console.log('📧 mail validation envoyé à', maskEmail(to));
  }
}

export async function sendSupportMail(fromEmail, fullname, subject, message) {
  const to = 'quickpopnoreply@gmail.com';
  const mailSubject = `[Support] Nouveau message de ${fullname}: ${subject}`;
  const text = `Message de ${fullname} (${fromEmail}):\n\n${message}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:10px;">
      <h2 style="color:#ef4444;">Nouveau message Support</h2>
      <p><strong>De:</strong> ${fullname} (<a href="mailto:${fromEmail}">${fromEmail}</a>)</p>
      <p><strong>Sujet:</strong> ${subject}</p>
      <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">
      <div style="background:#f9f9f9; padding:15px; border-radius:5px;">
        ${message.replace(/\n/g, '<br>')}
      </div>
    </div>
  `;

  await transporter.sendMail({ from: process.env.MAIL_FROM, to, replyTo: fromEmail, subject: mailSubject, text, html });
}

export default transporter
