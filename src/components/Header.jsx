import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const navLinks = [
  { label: 'Work',       href: '#manifesto' },
  { label: 'Shop',  href: '#shelf' },
  { label: 'Narratives', href: '#Narratives' },
  { label: 'Writing',    href: '#news' },
  { label: 'About',      href: '/about' },
]

export default function Header({ onNotifyClick, scrollTo }) {
  const headerRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  /* ── IntersectionObserver: watch [data-nav-theme] sections ── */
  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    // Start with "light" (hero is dark bg = white nav text)
    header.dataset.theme = 'light'

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            header.dataset.theme = entry.target.dataset.navTheme || 'light'
          }
        })
      },
      // Trigger when a section's top edge crosses the top 15% of the viewport
      { rootMargin: '0px 0px -85% 0px' }
    )

    document.querySelectorAll('[data-nav-theme]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  /* ── Entry animations ── */
  useEffect(() => {
    const items = headerRef.current?.querySelectorAll('.header__list-item')
    if (items) {
      gsap.fromTo(items,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: 'power2.out', delay: 1.8 }
      )
    }
    const pill = headerRef.current?.querySelector('.header__pill')
    if (pill) {
      gsap.fromTo(pill,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 2 }
      )
    }
    const hamburger = headerRef.current?.querySelector('.header__hamburger')
    if (hamburger) {
      gsap.fromTo(hamburger,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 1.8 }
      )
    }
  }, [])

  /* ── Close menu on scroll ── */
  useEffect(() => {
    const handleScroll = () => { if (menuOpen) setMenuOpen(false) }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [menuOpen])

  const handleNavClick = (href) => {
    setMenuOpen(false)
    // "/about" etc. are page routes, not hash scrolls
    if (href.startsWith('/')) {
      window.location.href = href
    } else {
      scrollTo(href)
    }
  }

  return (
    <>
      {/* Mobile full-screen nav overlay */}
      <nav className={`header__mobile-nav${menuOpen ? ' is-open' : ''}`}>
        {navLinks.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            onClick={(e) => { e.preventDefault(); handleNavClick(href) }}
          >
            {label}
          </a>
        ))}
        <button
          className="header__mobile-notify"
          onClick={() => { setMenuOpen(false); onNotifyClick() }}
        >
          <span className="label">Let's talk</span>
          <span className="circle">
            <svg width="17" height="14" viewBox="0 0 17 14" fill="none">
              <path d="M1 7L15.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M9.5 1L15.5 7L9.5 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>
      </nav>

      <header
        ref={headerRef}
        className="header"
        data-theme="light"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          zIndex: 700,
          background: 'transparent',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 80px',
          height: '100%',
          maxWidth: 1920,
          margin: '0 auto',
          width: '100%',
        }}>
          {/* Logo LEFT */}
          <a
            href="#hero"
            className="header__logo"
            onClick={(e) => { e.preventDefault(); scrollTo('#hero') }}
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
          >
            <svg
              width="140"
              height="23"
              viewBox="0 0 169 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2.84668 22.0625C4.26661 23.4068 6.34114 24.4882 8.88867 24.4883C10.1797 24.4883 11.5402 23.9307 12.8232 22.877L12.8916 22.8203L12.9688 22.8652C13.401 23.1139 13.8472 23.3371 14.3047 23.5342L14.4297 23.5879L14.3701 23.7119C13.9198 24.6514 13.5352 25.5886 13.2305 26.4873H7.39355C4.9224 26.4873 2.91272 24.5177 2.84668 22.0625ZM24.8223 23.2803C24.2495 25.1377 22.52 26.4872 20.4746 26.4873H16.2188C16.4377 25.8119 16.6998 25.1282 16.999 24.459L17.04 24.3662L17.1396 24.3848C18.0944 24.5614 19.1219 24.6504 20.1924 24.6504C22.0135 24.6504 23.5746 24.0941 24.8223 23.2803ZM24.2588 17.1758C24.5759 17.1758 24.8317 17.2739 25.0244 17.4287V19.4082C24.0881 20.6508 21.8145 21.9062 20.1104 21.9062C19.6062 21.9062 19.1074 21.8787 18.6299 21.8262L18.4199 21.8037L18.5361 21.625C20.3735 18.7979 22.4593 17.176 24.2588 17.1758ZM4.61914 17.249C6.36227 17.2491 7.6516 18.4559 9.14453 19.8525C9.5125 20.1967 9.89382 20.5524 10.3008 20.9102L10.4365 21.0303L10.2803 21.1221C9.53117 21.561 8.81786 21.7832 8.16016 21.7832C5.77227 21.7832 3.53711 19.5087 3.53711 18.4756C3.53732 17.8728 3.94215 17.249 4.61914 17.249ZM20.4746 1.13867C22.9873 1.13885 25.0244 3.17574 25.0244 5.68848V14.3555C24.8223 14.326 24.608 14.3086 24.3809 14.3086C21.6126 14.3087 18.4962 16.7636 15.8311 21.0439L15.7744 21.1367L15.6738 21.0957C15.5019 21.0252 15.3314 20.951 15.1631 20.8721L15.0078 20.7988L15.1191 20.668C17.3915 17.9716 18.748 14.6609 18.748 11.8125C18.7479 7.12891 16.039 5.89166 14.6064 5.8916C11.8225 5.8916 10.2257 8.04949 10.2256 11.8125C10.2256 14.9689 11.1035 16.9904 12.8359 17.8223C12.8793 17.7661 12.9229 17.7091 12.9658 17.6523L14.4775 15.1611C14.2825 15.1699 14.0829 15.09 13.8838 14.8818C13.3877 14.3626 12.8994 13.0711 12.9414 11.8086C13.0065 9.82832 13.6134 8.69238 14.6064 8.69238C15.4993 8.69274 16.1728 10.034 16.1729 11.8125C16.1729 13.7745 14.685 16.8495 12.6367 19.124L12.5557 19.2148L12.4609 19.1387C11.9257 18.7044 11.4209 18.2556 10.9326 17.8213C9.0437 16.1418 7.25909 14.5544 4.29297 14.4297C3.78106 14.4076 3.28967 14.5169 2.84375 14.7275V5.68848C2.84375 3.17563 4.88071 1.13867 7.39355 1.13867H20.4746Z" fill="currentColor"/>
              <path d="M35.5399 4.81641V12.7582H35.598C36.1799 10.2273 38.0126 8.88913 40.4853 8.88913C44.3835 8.88913 45.5471 11.4491 45.5471 14.3V22.6491H44.0053V14.591C44.0053 12.4673 43.1035 10.3146 40.1071 10.3146C37.2853 10.3146 35.5399 11.8855 35.5399 14.591V22.6491H33.998V4.81641H35.5399Z" fill="currentColor"/>
              <path d="M54.7744 22.94C50.5562 22.94 47.9671 20.2346 47.9671 15.9C47.9671 11.4782 50.818 8.88913 54.6871 8.88913C58.6144 8.88913 60.8544 11.391 60.8544 15.1146C60.8544 15.3473 60.8253 15.9 60.7962 16.3655H49.538C49.6544 19.5946 51.6035 21.5437 54.7453 21.5437C57.6253 21.5437 58.789 20.0019 59.3708 18.111L60.7671 18.5473C60.069 21.34 58.0326 22.94 54.7744 22.94ZM49.5671 15.0273H59.3708C59.2544 12.031 57.7417 10.2855 54.629 10.2855C51.8071 10.2855 49.8871 11.9146 49.5671 15.0273Z" fill="currentColor"/>
              <path d="M67.3365 22.5037L61.1983 9.18004H62.9437L65.0092 13.8928C65.7946 15.6673 67.2492 18.751 68.151 20.9037C69.0819 18.6637 70.3037 15.7546 71.0601 13.9219L73.0383 9.18004H74.6965L68.7328 22.8237C67.3655 25.8782 65.7655 27.1 63.4092 27.1C62.5946 27.1 61.9546 27.0128 61.4601 26.9255L61.7219 25.4419C62.3328 25.5582 62.8274 25.6455 63.4092 25.6455C65.0383 25.6455 66.1146 25.2382 67.3365 22.5037Z" fill="currentColor"/>
              <path d="M77.8535 9.18004V12.7582H77.9117C78.4935 10.2273 80.3262 8.88913 82.799 8.88913C86.0862 8.88913 87.4826 10.7219 87.7735 13.0782H87.8317C88.268 10.2855 89.868 8.88913 92.6899 8.88913C96.7044 8.88913 97.868 11.4491 97.868 14.3V22.6491H96.3262V14.591C96.3262 12.4673 95.4244 10.3146 92.399 10.3146C89.6062 10.3146 87.8608 11.8855 87.8608 14.591V22.6491H86.319V14.591C86.319 12.4673 85.4171 10.3146 82.4208 10.3146C79.599 10.3146 77.8535 11.8855 77.8535 14.591V22.6491H76.3117V9.18004H77.8535Z" fill="currentColor"/>
              <path d="M105.111 22.94C102.318 22.94 100.66 21.6891 100.66 19.2164C100.66 17.0928 102.201 15.3473 105.256 15.3473H110.201V14.3C110.201 11.711 109.271 10.2855 106.623 10.2855C104.267 10.2855 103.016 11.42 102.58 14.0964L101.096 13.8346C101.591 10.4891 103.54 8.88913 106.652 8.88913C110.143 8.88913 111.743 10.78 111.743 14.2419V22.6491H110.201V19.1582H110.172C109.561 21.7473 107.525 22.94 105.111 22.94ZM110.201 17.7619V16.6855H105.372C103.249 16.6855 102.201 17.5 102.201 19.1582C102.201 20.3219 102.987 21.5437 105.285 21.5437C108.311 21.5437 110.201 19.9437 110.201 17.7619Z" fill="currentColor"/>
              <path d="M116.631 9.18004V12.7582H116.689C117.271 10.2273 119.103 8.88913 121.576 8.88913C125.474 8.88913 126.638 11.4491 126.638 14.3V22.6491H125.096V14.591C125.096 12.4673 124.194 10.3146 121.198 10.3146C118.376 10.3146 116.631 11.8855 116.631 14.591V22.6491H115.089V9.18004H116.631Z" fill="currentColor"/>
              <path d="M134.993 22.9691C131.036 22.9691 129.494 21.1364 128.796 18.111L130.28 17.82C130.803 19.9146 131.851 21.6019 134.993 21.6019C137.32 21.6019 138.483 20.5837 138.483 19.071C138.483 17.6455 137.523 16.9473 134.294 16.4528C130.92 15.9582 129.611 14.6782 129.611 12.6128C129.611 10.4891 131.24 8.88913 134.294 8.88913C137.523 8.88913 138.92 10.46 139.618 13.1655L138.105 13.5437C137.523 11.1291 136.418 10.2273 134.323 10.2273C132.258 10.2273 131.153 11.1291 131.153 12.5255C131.153 13.8928 132.083 14.7364 134.963 15.1728C138.483 15.6673 140.054 16.9473 140.054 19.071C140.054 21.3982 138.367 22.9691 134.993 22.9691Z" fill="currentColor"/>
              <path d="M144.073 4.81641V12.7582H144.131C144.713 10.2273 146.546 8.88913 149.018 8.88913C152.916 8.88913 154.08 11.4491 154.08 14.3V22.6491H152.538V14.591C152.538 12.4673 151.636 10.3146 148.64 10.3146C145.818 10.3146 144.073 11.8855 144.073 14.591V22.6491H142.531V4.81641H144.073Z" fill="currentColor"/>
              <path d="M167.264 22.6491V19.071H167.235C166.653 21.631 164.82 22.94 162.347 22.94C158.449 22.94 157.286 20.38 157.286 17.5291V9.18004H158.827V17.2382C158.827 19.3619 159.7 21.5146 162.726 21.5146C165.547 21.5146 167.264 19.9437 167.264 17.2382V9.18004H168.806V22.6491H167.264Z" fill="currentColor"/>
            </svg>
          </a>
<nav className="header__nav-desktop" style={{ alignItems: 'center', gap: 30 }}>
              <ul style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
                {navLinks.map(({ label, href }) => (
                  <li
                    key={href}
                    className="header__list-item"
                    style={{ opacity: 0 }}
                  >
                    <a
                      href={href}
                      className="header__nav-link"
                      onClick={(e) => { e.preventDefault(); handleNavClick(href) }}
                      style={{ fontSize: 18, fontWeight: 500 }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          {/* Nav + CTA RIGHT */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
            {/* Desktop nav */}
            

            {/* Desktop CTA */}
            <div className="header__pill header__pill-desktop" style={{ opacity: 0 }}>
              <button
                onClick={onNotifyClick}
                className="btn header__cta-btn"
              >
                <span className="btn__text">Let's Talk</span>
                <span className="btn__arrow">→</span>
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className={`header__hamburger${menuOpen ? ' is-open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
