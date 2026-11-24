import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { contact, gallery, home, reel } from '../content/website.json'
import App from './App'
import { buildContactDraftUrl } from './contact'

const configuredVideo = reel.video

function openPortfolio(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
})

afterEach(() => {
  cleanup()
  reel.video = configuredVideo
  vi.restoreAllMocks()
})

describe('portfolio', () => {
  it('opens all five pages from the main navigation', () => {
    openPortfolio()
    const navigation = within(screen.getByRole('navigation', { name: 'Portfolio pages' }))
    const destinations = [
      ['About', 'About'],
      ['Headshot & Résumé', 'Headshot & Résumé'],
      ['Media', 'Media'],
      ['Contact', 'Contact'],
      ['Home', /Rayhan\s*Khimji/],
    ] as const

    for (const [label, heading] of destinations) {
      const link = navigation.getByRole('link', { name: label })
      fireEvent.click(link)
      expect(screen.getByRole('heading', { level: 1, name: heading })).toBeVisible()
      expect(link).toHaveAttribute('aria-current', 'page')
      expect(screen.getByRole('main')).toHaveFocus()
    }
  })

  it('links to the Media page and displays the pending reel status', () => {
    reel.video = ''
    openPortfolio()
    fireEvent.click(screen.getByRole('link', { name: home.mediaButton }))
    expect(screen.getByRole('heading', { name: 'Acting Reel' })).toBeVisible()
    expect(screen.getByText('Reel coming soon.')).toBeVisible()
    expect(screen.queryByRole('link', { name: 'Watch acting reel' })).not.toBeInTheDocument()
  })

  it('links to the acting reel when its URL is configured', () => {
    reel.video = 'https://example.test/acting-reel'
    openPortfolio('/media')
    const reelSection = within(screen.getByRole('region', { name: 'Acting Reel' }))
    expect(reelSection.getByRole('link', { name: 'Watch acting reel' })).toHaveAttribute('href', reel.video)
    expect(reelSection.queryByText('Reel coming soon.')).not.toBeInTheDocument()
  })

  it('shows a video player for an uploaded acting reel', () => {
    reel.video = 'acting-reel.mp4'
    openPortfolio('/media')
    const video = screen.getByRole('region', { name: 'Acting Reel' }).querySelector('video')
    expect(video).toHaveAttribute('src', '/videos/acting-reel.mp4')
    expect(video).toHaveAttribute('poster', `/images/${reel.poster}`)
    expect(video).toHaveAttribute('controls')
  })

  it('fades in loaded photos during navigation without replacing the viewer controls', () => {
    openPortfolio('/media')
    const dialog = screen.getByRole<HTMLDialogElement>('dialog', { hidden: true })
    dialog.showModal = () => { dialog.open = true }
    dialog.close = () => { dialog.open = false }

    const stills = screen.getAllByRole('button', { name: /^Open photo:/ })
    fireEvent.click(stills[0])
    const viewer = within(screen.getByRole('dialog', { name: gallery[0].title }))
    const next = viewer.getByRole('button', { name: 'Next photo' })
    expect(viewer.getByRole('img')).not.toHaveAttribute('data-fade')

    fireEvent.click(next)
    expect(dialog).toHaveAccessibleName(gallery[1].title)
    expect(viewer.getByRole('button', { name: 'Next photo' })).toBe(next)
    const nextImage = viewer.getByRole('img')
    expect(nextImage).toHaveAttribute('data-fade')
    expect(nextImage).not.toHaveAttribute('data-loaded')
    fireEvent.load(nextImage)
    expect(nextImage).toHaveAttribute('data-loaded')

    fireEvent.keyDown(dialog, { key: 'ArrowRight' })
    expect(dialog).toHaveAccessibleName(gallery[2].title)
    fireEvent.click(viewer.getByRole('button', { name: 'Close photo viewer' }))
    fireEvent.click(stills[2])
    expect(dialog).toBeVisible()
    expect(viewer.getByRole('img')).not.toHaveAttribute('data-fade')
  })

  it('provides the casting downloads from a direct route', () => {
    openPortfolio('/headshot-resume')
    const headshot = screen.getByRole('link', { name: 'Download Headshot (JPG)' })
    const resume = screen.getByRole('link', { name: 'Download Performance Résumé (PDF)' })
    expect(headshot).toHaveAttribute('download')
    expect(resume).toHaveAttribute('download')
    expect(headshot.getAttribute('href')).toMatch(/\/images\/rayhan-headshot\.jpg$/)
    expect(resume.getAttribute('href')).toMatch(/\/downloads\/rayhan-khimji-resume\.pdf$/)
    const resumePreview = screen.getByRole('link', { name: 'Open Performance Résumé (PDF) in a new tab' })
    expect(resumePreview).toHaveAttribute('href', resume.getAttribute('href'))
    expect(resumePreview).toHaveAttribute('target', '_blank')
    expect(resumePreview.querySelector('img')).toHaveAttribute('src', '/images/rayhan-resume-preview.png')
  })

  it('lists the configured agent as the contact', () => {
    openPortfolio('/contact')
    expect(screen.getByText(contact.name, { selector: 'strong' })).toBeVisible()
    expect(screen.getByText(`Agent · ${contact.agency}`)).toBeVisible()
    expect(screen.getByRole('link', { name: contact.email }))
      .toHaveAttribute('href', `mailto:${contact.email}`)
  })

  it('formats a contact draft from the form fields', () => {
    openPortfolio('/contact')
    const form = screen.getByRole<HTMLFormElement>('form', { name: `Contact ${contact.name}` })
    fireEvent.input(screen.getByLabelText('First name'), { target: { value: '   Zoë  ' } })
    fireEvent.input(screen.getByLabelText('Last name'), { target: { value: 'Smith & Lee' } })
    fireEvent.input(screen.getByLabelText('Email address'), { target: { value: 'hello+casting@example.com' } })
    fireEvent.input(screen.getByLabelText('Message'), { target: { value: 'Studio A?\nTuesday & Thursday both work.' } })

    const draft = new URL(buildContactDraftUrl(new FormData(form)))
    expect(draft.protocol).toBe('mailto:')
    expect(draft.pathname).toBe(contact.email)
    expect(draft.searchParams.get('subject')).toBe('Rayhan Khimji portfolio inquiry')
    expect(draft.searchParams.get('body')).toBe(
      'Name: Zoë Smith & Lee\r\nEmail: hello+casting@example.com\r\n\r\nStudio A?\r\nTuesday & Thursday both work.',
    )
  })

  it('offers a way back from an unknown route', () => {
    openPortfolio('/missing')
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeVisible()
    fireEvent.click(screen.getByRole('link', { name: 'Back to Home' }))
    expect(screen.getByRole('heading', { level: 1, name: /Rayhan\s*Khimji/ })).toBeVisible()
  })
})
