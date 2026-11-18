import React from 'react'
import "../../../assets/styles/landing/features.css"

const FeaturesSection = () => {
  return (
    <section className="bz-section bz-features" id="features">
        <div className="bz-section-heading">
          <span className="bz-section-kicker">WHAT BIZOOP BRINGS TOGETHER</span>
          <h2>Everything your restaurant needs to run smoothly.</h2>
          <p>Connect front-of-house, kitchen and back-office work in a single operating flow.</p>
        </div>
        <div className="bz-highlight-grid">
          <div className="bz-highlight"><span className="bz-highlight-check">✓</span><span>Restaurant sales and billing</span></div>
          <div className="bz-highlight"><span className="bz-highlight-check">✓</span><span>Floor and table management</span></div>
          <div className="bz-highlight"><span className="bz-highlight-check">✓</span><span>Kitchen and KOT coordination</span></div>
          <div className="bz-highlight"><span className="bz-highlight-check">✓</span><span>Inventory and purchase control</span></div>
          <div className="bz-highlight"><span className="bz-highlight-check">✓</span><span>Staff and customer management</span></div>
          <div className="bz-highlight"><span className="bz-highlight-check">✓</span><span>Business intelligence and reports</span></div>
        </div>
      </section>
  )
}

export default FeaturesSection
