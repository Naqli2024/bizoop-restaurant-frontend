import { useEffect, useState } from "react";
import "../../../assets/styles/landing/herosection.css"
import { useNavigate } from "react-router-dom";

// Counts from 0 to `target` once on mount (skipped if reduced motion is on)
function useCountUp(target, duration = 1400, delay = 700) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf;
    let start;
    const timer = setTimeout(() => {
      const tick = (now) => {
        if (start === undefined) start = now;
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        setValue(Math.round(target * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);

  return value;
}

const OPERATIONS = [
  { tone: "amber", icon: "₹", title: "Billing & sales", sub: "Payments and reports" },
  { tone: "blue", icon: "♨", title: "Kitchen & KOT", sub: "Orders and preparation" },
  { tone: "green", icon: "▦", title: "Inventory & store", sub: "Stock and wastage" },
];

export default function HeroSection() {
  const sales = useCountUp(48250);
  const orders = useCountUp(128, 1100);
  const navigate=useNavigate()

  return (
    <section className="bz-hero">
      <div className="bz-hero-copy">
        <div className="bz-eyebrow bz-in" style={{ "--i": 0 }}>
          <span className="bz-live-dot" /> RESTAURANT BUSINESS OPERATING SYSTEM
        </div>

        <h1 className="bz-in" style={{ "--i": 1 }}>
          Run your restaurant.
          <br />
          <span className="bz-shimmer">All in one place.</span>
        </h1>

        <p className="bz-hero-description bz-in" style={{ "--i": 2 }}>
          Manage your sales, service, kitchen, inventory and business operations
          with one connected restaurant platform.
        </p>

        <div className="bz-hero-actions bz-in" style={{ "--i": 3 }}>
          <button className="bz-primary-btn" type="button" onClick={()=>navigate('/login')}>
            Login to BIZOOP <span className="bz-btn-arrow">→</span>
          </button>
          <a className="bz-secondary-link" href="#features">
            Explore features <span className="bz-bounce-arrow">↓</span>
          </a>
        </div>

        <div className="bz-hero-note bz-in" style={{ "--i": 4 }}>
          <span>✓</span> Built for everyday restaurant operations
        </div>
      </div>

      <div className="bz-hero-visual" aria-label="Restaurant operations preview">
        <div className="bz-orbit bz-orbit-one" />
        <div className="bz-orbit bz-orbit-two" />

        <div className="bz-dashboard-card">
          <div className="bz-preview-top">
            <div>
              <span className="bz-preview-label">BIZOOP BOS</span>
              <h3>Restaurant overview</h3>
            </div>
            <span className="bz-preview-status">
              <i /> Live workspace
            </span>
          </div>

          <div className="bz-preview-metrics">
            <div>
              <span>Sales</span>
              <strong>₹ {sales.toLocaleString("en-IN")}</strong>
              <small>Today's overview</small>
            </div>
            <div>
              <span>Orders</span>
              <strong>{orders}</strong>
              <small>Across channels</small>
            </div>
          </div>

          <div className="bz-preview-section-title">Restaurant operations</div>

          {OPERATIONS.map((op, idx) => (
            <div
              className="bz-preview-row bz-row-in"
              style={{ "--r": idx }}
              key={op.title}
            >
              <span className={`bz-preview-icon ${op.tone}`}>{op.icon}</span>
              <span>
                <b>{op.title}</b>
                <small>{op.sub}</small>
              </span>
              <span className="bz-preview-arrow">↗</span>
            </div>
          ))}

          <div className="bz-preview-bottom">
            <span>One connected workspace</span>
            <span className="bz-preview-bars">
              <i /><i /><i /><i /><i />
            </span>
          </div>
        </div>

        <div className="bz-float-card bz-float-top">
          <span className="bz-float-symbol">✦</span>
          <span>
            <b>Business insights</b>
            <small>Know what needs attention</small>
          </span>
        </div>

        <div className="bz-float-card bz-float-bottom">
          <span className="bz-float-symbol bz-float-green">✓</span>
          <span>
            <b>Connected operations</b>
            <small>From order to settlement</small>
          </span>
        </div>
      </div>
    </section>
  );
}
