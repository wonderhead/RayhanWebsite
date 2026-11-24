import { useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { flushSync } from 'react-dom'
import { Link } from 'react-router-dom'
import bio from '../content/bio.txt?raw'
import { about, contact, gallery, reel } from '../content/website.json'
import { buildContactDraftUrl } from './contact'

const base = import.meta.env.BASE_URL
const bioParagraphs = bio.trim().split(/\r?\n(?:[ \t]*\r?\n)+/).filter(Boolean)

export function AboutPage() {
  return (
    <div className="inner-page">
      <h1>About</h1>
      <div className="inner-split">
        <div className="text-column">
          {bioParagraphs.map((paragraph, index) => (
            <p className={index === 0 ? 'intro-copy' : undefined} key={index}>{paragraph}</p>
          ))}
        </div>
        <figure className="site-figure">
          <img
            src={`${base}images/on-set-with-cast.jpg`}
            alt={about.photoDescription}
            width="1200"
            height="800"
          />
          <figcaption>{about.photoCaption} {about.productionTitle && <em>{about.productionTitle}</em>}</figcaption>
        </figure>
      </div>
    </div>
  )
}

type CastingMaterialProps = {
  title: string
  format: 'PDF' | 'JPG'
  description: string
  file: string
  preview: string
  width: number
  height: number
}

function CastingMaterial({ title, format, description, file, preview, width, height }: CastingMaterialProps) {
  const href = `${base}${file}`
  const openLabel = `Open ${title} (${format}) in a new tab`
  const downloadLabel = `Download ${title} (${format})`

  return (
    <section className="casting-material" data-format={format}>
      <a className="casting-preview" href={href} target="_blank" rel="noopener" aria-label={openLabel} title={openLabel}>
        <img src={`${base}images/${preview}`} alt="" width={width} height={height} />
        <span className="casting-open-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 18 18 6M8 6h10v10" />
          </svg>
        </span>
      </a>
      <div className="casting-material-details">
        <div>
          <p>{description}</p>
          <h2>{title}</h2>
        </div>
        <a className="casting-download" href={href} download aria-label={downloadLabel}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v13m-5-5 5 5 5-5M5 21h14" />
          </svg>
          Download
        </a>
      </div>
    </section>
  )
}

export function ResourcesPage() {
  return (
    <div className="inner-page casting-page">
      <h1>Headshot &amp; Résumé</h1>
      <div className="inner-split casting-materials">
        <CastingMaterial
          title="Performance Résumé"
          format="PDF"
          description="PDF document"
          file="downloads/rayhan-khimji-resume.pdf"
          preview="rayhan-resume-preview.png"
          width={1100}
          height={1423}
        />
        <CastingMaterial
          title="Headshot"
          format="JPG"
          description="High-resolution photograph"
          file="images/rayhan-headshot.jpg"
          preview="rayhan-hero-small.jpg"
          width={920}
          height={736}
        />
      </div>
    </div>
  )
}

function ActingReel() {
  const video = reel.video.trim()
  const hosted = video.startsWith('https://')
  const poster = `${base}images/${reel.poster}`

  if (video && !hosted) {
    return (
      <section className="reel-player" aria-labelledby="acting-reel-title">
        <h2 id="acting-reel-title">Acting Reel</h2>
        <video
          aria-labelledby="acting-reel-title"
          src={`${base}videos/${video}`}
          poster={poster}
          controls
          playsInline
          preload="metadata"
        />
      </section>
    )
  }

  return (
    <section className="reel" aria-labelledby="acting-reel-title">
      <img className="reel-poster" src={poster} alt="" fetchPriority="high" />
      <div className="reel-label">
        {hosted ? (
          <a className="reel-play" href={video} aria-label="Watch acting reel">
            <span className="reel-mark" aria-hidden="true">▶</span>
          </a>
        ) : (
          <span className="reel-mark" aria-hidden="true">▶</span>
        )}
        <div>
          <h2 id="acting-reel-title">Acting Reel</h2>
          {!hosted && <p>Reel coming soon.</p>}
        </div>
      </div>
    </section>
  )
}

export function MediaPage() {
  const viewer = useRef<HTMLDialogElement>(null)
  const [{ index: photoIndex, fadeImage }, setPhotoSelection] = useState({ index: 0, fadeImage: false })
  const photo = gallery[photoIndex]

  function openPhoto(index: number) {
    // Set the dialog's accessible name before showModal moves focus into it.
    flushSync(() => setPhotoSelection({ index, fadeImage: false }))
    viewer.current?.showModal()
  }

  function movePhoto(step: number) {
    setPhotoSelection(({ index }) => ({
      index: (index + step + gallery.length) % gallery.length,
      fadeImage: true,
    }))
  }

  function handlePhotoKeys(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()
    movePhoto(event.key === 'ArrowLeft' ? -1 : 1)
  }

  return (
    <div className="inner-page">
      <h1>Media</h1>
      <ActingReel />
      <section className="media">
        <h2>Stage &amp; Screen Stills</h2>
        <div className="media-grid">
          {gallery.map(({ image, title, thumbnailPosition }, index) => (
            <figure className="site-figure" key={image}>
              <button type="button" className="still-button" aria-label={`Open photo: ${title}`} onClick={() => openPhoto(index)}>
                <img
                  src={`${base}images/${image}`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: thumbnailPosition }}
                />
              </button>
              <figcaption>{title}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <dialog className="photo-viewer" ref={viewer} aria-labelledby="media-photo-title" onKeyDown={handlePhotoKeys}>
        <div className="photo-viewer-content">
          <div className="photo-viewer-header">
            <h2 id="media-photo-title">{photo.title}</h2>
            <button type="button" className="photo-icon" aria-label="Close photo viewer" onClick={() => viewer.current?.close()}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <img
            key={photo.image}
            className="photo-viewer-image"
            src={`${base}images/${photo.image}`}
            alt={photo.alt}
            data-fade={fadeImage || undefined}
            onLoad={({ currentTarget }) => { currentTarget.dataset.loaded = 'true' }}
          />
          <div className="photo-viewer-controls">
            <button type="button" className="photo-icon" aria-label="Previous photo" onClick={() => movePhoto(-1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
            </button>
            <output aria-label="Photo position" aria-live="polite">{photoIndex + 1} / {gallery.length}</output>
            <button type="button" className="photo-icon" aria-label="Next photo" onClick={() => movePhoto(1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export function ContactPage() {
  function validateText(event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = event.currentTarget
    field.setCustomValidity(field.value && !field.value.trim() ? 'Enter a value for this field.' : '')
  }

  function openEmailDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    window.location.href = buildContactDraftUrl(new FormData(event.currentTarget))
  }

  return (
    <div className="inner-page inner-split contact-page">
      <div>
        <h1>Contact</h1>
        <p className="intro-copy">{contact.intro}</p>
        <address className="contact-details">
          <img src={`${base}images/zuri-agency-logo.jpg`} alt="" width="418" height="480" />
          <div className="contact-agent">
            <strong>{contact.name}</strong>
            <span>Agent · {contact.agency}</span>
            <a className="text-link" href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
        </address>
      </div>
      <form className="contact-form" aria-label={`Contact ${contact.name}`} onSubmit={openEmailDraft}>
        <div className="contact-name-fields">
          <label>
            <span>First name</span>
            <input name="firstName" autoComplete="given-name" required onInput={validateText} />
          </label>
          <label>
            <span>Last name</span>
            <input name="lastName" autoComplete="family-name" required onInput={validateText} />
          </label>
        </div>
        <label>
          <span>Email address</span>
          <input type="email" name="email" autoComplete="email" required />
        </label>
        <label>
          <span>Message</span>
          <textarea name="message" rows={4} required onInput={validateText} />
        </label>
        <div className="contact-form-actions">
          <button className="site-link" type="submit" aria-describedby="contact-draft-note">Open email draft</button>
          <p id="contact-draft-note">Review and send the draft in your email app.</p>
        </div>
      </form>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="inner-page">
      <h1>Page not found</h1>
      <Link className="site-link" to="/">Back to Home</Link>
    </div>
  )
}
