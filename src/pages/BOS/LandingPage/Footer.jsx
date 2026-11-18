import React from 'react'
import "../../../assets/styles/landing/footer.css"
import { useLocation } from 'react-router-dom'

const Footer = () => {
     const { pathname } = useLocation()
    const handleHomeClick = (e) => {
    // Already on the home page: don't reload, just scroll up smoothly
    if (pathname === '/') {
      e.preventDefault()
      const home = document.getElementById('home')
      if (home) {
        home.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    // On any other page: the Link navigates to "/" normally
  }
  return (
    <footer className="bz-footer">
      <a className="bz-footer-brand" href="#home" onClick={handleHomeClick}>BIZOOP<span>.</span></a>
      <span>Restaurant Business Operating System</span>
      <span>© <span id="currentYear">2026</span> BIZOOP</span>
    </footer>
  )
}

export default Footer
