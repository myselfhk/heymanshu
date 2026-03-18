export default function Footer({ onNotifyClick, scrollTo }) {
  const nav = (href, target) => (e) => {
    if (scrollTo) {
      e.preventDefault()
      scrollTo(target)
    }
  }

  return (
    <footer className="footer-strip">

      {/* Left: nav links */}
      <nav className="footer-strip__nav">
        <a href="/#manifesto"  className="footer-strip__nav-link" onClick={nav('/#manifesto', '#manifesto')}>Work</a>
        <a href="/#shelf"      className="footer-strip__nav-link" onClick={nav('/#shelf', '#shelf')}>Shop</a>
        <a href="/#Narratives" className="footer-strip__nav-link" onClick={nav('/#Narratives', '#Narratives')}>Narratives</a>
        <a href="/about"       className="footer-strip__nav-link">About</a>
      </nav>

      {/* Centre: location + copyright */}
      <div className="footer-strip__location">
        Built with intention · Jaipur, India<br />
        © 2025 heymanshu
      </div>

      {/* Right: social + handle */}
      <div className="footer-strip__social">
        <a href="https://linkedin.com/in/itsheymanshu"  target="_blank" rel="noopener noreferrer" className="footer-strip__social-link">LinkedIn</a>
        <a href="https://x.com/itsheymanshu"            target="_blank" rel="noopener noreferrer" className="footer-strip__social-link">X</a>
        <a href="https://instagram.com/itsheymanshu"    target="_blank" rel="noopener noreferrer" className="footer-strip__social-link">Instagram</a>
        <span className="footer-strip__handle">@itsheymanshu</span>
      </div>

    </footer>
  )
}
