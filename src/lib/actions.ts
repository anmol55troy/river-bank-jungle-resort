'use server'

import { connectDB } from './db/connect'
import { FormSubmissionModel, NewsletterSignupModel } from './db/models'
import { sendEmail } from './email'

export type FormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export async function submitEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const formType = formData.get('formType') === 'events' ? 'events' : 'contact'
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const subject = String(formData.get('subject') ?? '').trim()
  const eventDate = String(formData.get('eventDate') ?? '').trim()
  const guests = Number(formData.get('guests') ?? 0)
  const message = String(formData.get('message') ?? '').trim()
  // Honeypot field — bots fill it, humans never see it
  const company = String(formData.get('company') ?? '')

  if (company) return { status: 'success' }
  if (!name || !isEmail(email) || !message) {
    return { status: 'error', message: 'Please fill in your name, a valid email and a message.' }
  }

  try {
    await connectDB()
    await FormSubmissionModel.create({
      formType,
      name,
      email,
      phone: phone || undefined,
      subject: subject || undefined,
      eventDate: eventDate || undefined,
      guests: guests > 0 ? guests : undefined,
      message,
    })

    // Optional email notification when SMTP is configured via env
    if (process.env.SMTP_HOST && process.env.CONTACT_NOTIFY_EMAIL) {
      try {
        await sendEmail({
          to: process.env.CONTACT_NOTIFY_EMAIL,
          subject: `[Website ${formType === 'events' ? 'Events' : 'Contact'} Enquiry] ${subject || name}`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            phone && `Phone: ${phone}`,
            eventDate && `Preferred date: ${eventDate}`,
            guests > 0 && `Guests: ${guests}`,
            '',
            message,
          ]
            .filter(Boolean)
            .join('\n'),
        })
      } catch (err) {
        // Submission is already stored — a failed notification email is non-fatal
        console.error('Enquiry notification email failed:', err)
      }
    }

    return { status: 'success' }
  } catch (err) {
    console.error('Enquiry submission failed:', err)
    return { status: 'error' }
  }
}

export async function subscribeNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get('email') ?? '').trim()
  if (!isEmail(email)) return { status: 'error', message: 'Please enter a valid email address.' }

  try {
    await connectDB()
    const existing = await NewsletterSignupModel.findOne({ email: email.toLowerCase() })
    if (!existing) {
      await NewsletterSignupModel.create({ email: email.toLowerCase() })
    }
    return { status: 'success' }
  } catch (err) {
    console.error('Newsletter signup failed:', err)
    return { status: 'error' }
  }
}
