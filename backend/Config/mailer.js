import nodemailer from 'nodemailer'

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
  const from = process.env.MAIL_FROM 
  const subject = 'Code de réinitialisation QuickPop'

  const text = `Votre code de réinitialisation est : ${code}
Il expire dans 10 minutes.`

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h2>Réinitialisation du mot de passe</h2>
      <p>Utilisez le code ci-dessous pour réinitialiser votre mot de passe.</p>
      <div style="
        font-size:24px;
        font-weight:bold;
        letter-spacing:6px;
        padding:12px 16px;
        background:#f7f7f7;
        border:1px solid #ddd;
        display:inline-block;
      ">
        ${code}
      </div>
      <p style="margin-top:12px;">
        Ce code expire dans <strong>10 minutes</strong>.
      </p>
      <p style="font-size:13px;color:#666;">
        Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.
      </p>
    </div>
  `

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  })

  /* =========================
     LOGS (DEV ONLY)
  ========================= */
  if (process.env.NODE_ENV !== 'production') {
    try {
      console.log('📧 reset code envoyé à', maskEmail(to))
      console.log('🆔 messageId:', info?.messageId || 'jsonTransport')
    } catch {}
  }
}

/* =========================
   MAIL ACCOUNT VALIDATION
========================= */
export async function sendAccountValidationMail(to, fullname) {
  const from = process.env.MAIL_FROM 
  const subject = 'Votre compte QuickPop a été validé !'

  const text = `Bonjour ${fullname},
Votre compte a été validé par un administrateur.
Vous pouvez maintenant vous connecter à l'application.
À très bientôt sur QuickPop !`

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h2>Compte Validé ✅</h2>
      <p>Bonjour <strong>${fullname}</strong>,</p>
      <p>Bonne nouvelle ! Votre compte a été validé par un administrateur.</p>
      <p>Vous pouvez dès à présent vous connecter à l'application avec vos identifiants.</p>
      <div style="margin: 20px 0;">
        <a href="${process.env.FRONTEND_URL || '#'}" style="background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Se connecter</a>
      </div>
      <p style="font-size:13px;color:#666;">
        À très bientôt sur QuickPop !
      </p>
    </div>
  `

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  })

  if (process.env.NODE_ENV !== 'production') {
    try {
      console.log('📧 mail validation envoyé à', maskEmail(to))
    } catch {}
  }
}

export default transporter
