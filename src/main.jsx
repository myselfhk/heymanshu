import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/fonts.css'
import './styles/typography.css'
import './styles/global.css'
import App from './App.jsx'
import CaseStudy from './pages/CaseStudy.jsx'
import About from './pages/About.jsx'
import Writing from './pages/Writing.jsx'
import Article from './pages/Article.jsx'
import ShelfPage from './pages/ShelfPage.jsx'
import PageTransition from './components/PageTransition.jsx'
import CustomCursor from './components/CustomCursor.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CustomCursor />
    <PageTransition />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/work/:slug" element={<CaseStudy />} />
      <Route path="/about" element={<About />} />
      <Route path="/writing" element={<Writing />} />
      <Route path="/writing/:slug" element={<Article />} />
      <Route path="/shelf" element={<ShelfPage />} />
    </Routes>
  </BrowserRouter>,
)
