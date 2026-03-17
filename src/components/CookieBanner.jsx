import { useState } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div
      className="cookie-banner"
      style={{
        position: 'fixed',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#ffffff',
        color: '#161616',
        borderRadius: 60,
        padding: '10px 24px 10px 28px',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 16,
        gap: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        transition: 'opacity 0.6s cubic-bezier(0.77, 0, 0.18, 1)',
      }}
    >
      <span style={{ lineHeight: '1.4' }}>
        This website uses cookies.{' '}
        <a href="#" style={{ textDecoration: 'underline' }}>Learn more</a>
      </span>
      <button
        onClick={() => setVisible(false)}
        style={{
          background: 'transparent',
          border: '1px solid #161616',
          borderRadius: 82,
          padding: '5px 14px 4px',
          fontSize: 15,
          cursor: 'pointer',
          color: '#161616',
          fontFamily: 'inherit',
          flexShrink: 0,
          transition: 'background 0.2s, color 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#161616'; e.currentTarget.style.color = '#fff' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#161616' }}
      >
        Okay
      </button>
    </div>
  )
}
