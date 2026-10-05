import nodemailer from 'nodemailer'

interface SendEmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions): Promise<boolean> {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host) {
    return false
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    })

    await transporter.sendMail({
      from: user || `"River Bank Jungle Resort" <noreply@riverbankjungleresort.com.np>`,
      to,
      subject,
      text,
      html,
    })

    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}
