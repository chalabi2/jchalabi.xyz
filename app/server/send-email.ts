'use server'

import { Resend } from 'resend'
import { ContactFormSchema } from '@/lib/schema'
import type { ContactFormInput } from '@/lib/schema'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(data: ContactFormInput) {
  const result = ContactFormSchema.safeParse(data)
  
  if (!result.success) {
    return { error: 'Invalid form data' }
  }

  try {
    await resend.emails.send({
      from: 'Contact Form <contact@jchalabi.xyz>',
      to: ['contact@jchalabi.xyz'],
      subject: `${result.data.subject}`,
      text: `
Name: ${result.data.name}
Email: ${result.data.email}
Subject: ${result.data.subject}

Message:
${result.data.message}
      `,
    })

    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to send email. Please try again.' }
  }
} 