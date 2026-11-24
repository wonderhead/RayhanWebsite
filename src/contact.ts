import { contact } from '../content/website.json'
import { actorName } from './actor'

export function buildContactDraftUrl(fields: FormData) {
  const firstName = String(fields.get('firstName') ?? '').trim()
  const lastName = String(fields.get('lastName') ?? '').trim()
  const email = String(fields.get('email') ?? '').trim()
  const message = String(fields.get('message') ?? '').trim().replace(/\r?\n/g, '\r\n')
  const subject = `${actorName} portfolio inquiry`
  const body = [`Name: ${firstName} ${lastName}`, `Email: ${email}`, '', message].join('\r\n')

  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
