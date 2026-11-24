import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { home } from '../content/website.json'
import { actor, actorName } from './actor'
import { AboutPage, ContactPage, MediaPage, NotFoundPage, ResourcesPage } from './pages'

const base = import.meta.env.BASE_URL

function HomePage() {
  return (
    <div className="cinema-hero">
      <img
        className="hero-photo"
        src={`${base}images/rayhan-hero.jpg`}
        srcSet={`${base}images/rayhan-hero-small.jpg 920w, ${base}images/rayhan-hero.jpg 1800w`}
        sizes="(max-width: 540px) 100vw, min(76vw, 59rem)"
        alt={`Portrait of ${actorName}`}
        width="1800"
        height="1440"
        fetchPriority="high"
      />
      <div className="hero-copy">
        <p className="discipline">{home.tagline}</p>
        <h1 className="actor-name">{actor.firstName}<br />{' '}{actor.lastName}</h1>
        <Link className="site-link" to="/media">{home.mediaButton}</Link>
      </div>
    </div>
  )
}

function PortfolioFooter() {
  const footer = useRef<HTMLElement>(null)
  const [ruleVisible, setRuleVisible] = useState(typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    if (!footer.current || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return

      setRuleVisible(true)
      observer.disconnect()
    })

    observer.observe(footer.current)
    return () => observer.disconnect()
  }, [])

  return (
    <footer className="actor-footer" ref={footer} data-rule-visible={ruleVisible}>
      <span className="footer-wordmark">{actorName}</span>
      <Link className="nav-item footer-contact" to="/contact">
        Contact <span aria-hidden="true">↗</span>
      </Link>
    </footer>
  )
}

const pages = [
  { to: '/', label: 'Home', Component: HomePage },
  { to: '/about', label: 'About', Component: AboutPage },
  { to: '/headshot-resume', label: 'Headshot & Résumé', Component: ResourcesPage },
  { to: '/media', label: 'Media', Component: MediaPage },
  { to: '/contact', label: 'Contact', Component: ContactPage },
]

export default function App() {
  const { pathname } = useLocation()
  const main = useRef<HTMLElement>(null)
  const previousPath = useRef(pathname)

  useEffect(() => {
    const pagePath = pathname.replace(/\/+$/, '') || '/'
    const label = pages.find(({ to }) => to === pagePath)?.label ?? 'Page not found'
    document.title = label === 'Home' ? `${actorName} | Actor` : `${label} | ${actorName}`
    if (previousPath.current !== pathname) {
      previousPath.current = pathname
      window.scrollTo(0, 0)
      main.current?.focus({ preventScroll: true })
    }
  }, [pathname])

  return (
    <div className="site-frame">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="actor-header">
        <Link className="actor-brand" to="/">{actorName}</Link>
        <nav className="actor-nav" aria-label="Portfolio pages">
          {pages.map(({ to, label }) => (
            <NavLink className="nav-item" end to={to} key={to}>{label}</NavLink>
          ))}
        </nav>
      </header>
      <main id="main" ref={main} tabIndex={-1}>
        <Routes>
          {pages.map(({ to, Component }) => (
            <Route path={to} element={<Component />} key={to} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <PortfolioFooter key={pathname} />
    </div>
  )
}
