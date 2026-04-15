
 import { useState, useEffect, useCallback } from "react";
import "./App.css";
import logoWhite from "./assets/M90SEVEN_LOGO_ABB_WHITE.png";
import whatsapp_icon from "./assets/Whatsapp_Icon_BB.png"; 
import linkedin_icon from "./Assets/LinkedIn_Icon_BB.png";

/*
  PHOTOGRAPHY SITE — MULTI-BRAND SKELETON
  ========================================
  Three variants, one codebase:
    m90seven.events.co.uk     → theme="events"    (dark)
    m90seven.weddings.co.uk   → theme="weddings"  (light/white)
    m90seven.lifestyle.co.uk  → theme="lifestyle"  (flat colour)

  In production, set theme via:
    - env variable: VITE_THEME=events
    - or derive from window.location.hostname
    - or pass as prop: <App theme="events" />

  CMS:   Cloudinary (free tier)
  Book:  Cal.com (free tier)
  Build: Vite + React
*/

// ── THEME CONFIG ────────────────────────────────────────────────────
const CURRENT_THEME = "events";

const THEMES = {
  events: {
    "--bg": "#111",
    "--bg-secondary": "#1a1a1a",
    "--text": "#e8e8e8",
    "--text-muted": "#ffffff",
    "--border": "#2a2a2a",
    "--accent": "#fff",
    "--surface": "#1e1e1e",
    "--overlay": "rgba(0,0,0,0.85)",
    "--modal-bg": "#1a1a1a",
    "--nav-bg": "rgba(17,17,17,0.95)",
    "--tab-inactive": "#666",
    label: "Events",
  },
  weddings: {
    "--bg": "#faf9f7",
    "--bg-secondary": "#f3f1ed",
    "--text": "#2a2a2a",
    "--text-muted": "#999",
    "--border": "#e5e0d8",
    "--accent": "#2a2a2a",
    "--surface": "#fff",
    "--overlay": "rgba(0,0,0,0.88)",
    "--modal-bg": "#fff",
    "--nav-bg": "rgba(250,249,247,0.95)",
    "--tab-inactive": "#bbb",
    label: "Weddings",
  },
  lifestyle: {
    "--bg": "#f0ece4",
    "--bg-secondary": "#e6e0d4",
    "--text": "#3a3530",
    "--text-muted": "#8a8580",
    "--border": "#d4cec4",
    "--accent": "#6b8f71",
    "--surface": "#f7f4ee",
    "--overlay": "rgba(0,0,0,0.88)",
    "--modal-bg": "#f7f4ee",
    "--nav-bg": "rgba(240,236,228,0.95)",
    "--tab-inactive": "#aaa59e",
    label: "Lifestyle",
  },
};

// ── PLACEHOLDER DATA ────────────────────────────────────────────────
const HERO_SLIDES = [
  { id: 1, color: "#444" },
  { id: 2, color: "#555" },
  { id: 3, color: "#666" },
];

const CATEGORIES = [
  { slug: "galas", label: "Galas" },
  { slug: "corporate", label: "Corporate" },
  { slug: "Performing Arts", label: "Performing Arts" },
  { slug: "Private Gatherings", label: "Private Gatherings" },
];

const GALLERY_IMAGES = {
  galas: Array.from({ length: 16 }, (_, i) => ({ id: `galas-${i + 1}`, color: `hsl(0,0%,${55 + i * 4}%)` })),
  corporate: Array.from({ length: 16}, (_, i) => ({ id: `corp-${i + 1}`, color: `hsl(0,0%,${50 + i * 5}%)` })),
  "Performing Arts": Array.from({ length: 16 }, (_, i) => ({ id: `port-${i + 1}`, color: `hsl(0,0%,${52 + i * 5}%)` })),
  "Private Gatherings": Array.from({ length: 16 }, (_, i) => ({ id: `evt-${i + 1}`, color: `hsl(0,0%,${48 + i * 5}%)` })),
};

const TESTIMONIALS = [
  { name: "Aneta Machyckova", role: "Google", text: "His photos feel like movie frames, recreating each moment with a beautiful sense of wonder. Professional without being stiff, creative without overdoing it, and always goes the extra mile." },
  { name: "Milena Zeqo", role: "Essex Court Chambers", text: "Full control of his craft, driven by a genuine passion for what he does. Highly professional, articulate, consistently reliable, and always delivers artistically brilliant images." },
  { name: "Lauren Carter", role: "Deka Chambers", text: "Very attentive to our needs for a Silks Celebration, made sure every moment was beautifully captured. Went above and beyond to deliver stunning images, both elegant formal shots and intimate, candid moments." },
  { name: "Esmerjan Licaj", role: "UKAP Foundation", text: "Incredibly responsive to our needs for a corporate gala, ensuring every detail was flawlessly captured. Delivered breathtaking photos — striking professional portraits and warm, spontaneous moments that truly brought the event to life." },
  { name: "Ambra Azizi", role: "OmniaMed Communications", text: "Creative and full of ideas. A fluid and authentic approach to capturing key moments across a variety of events, from professional networking to educational panels." },
  { name: "Driton Bilali", role: "Ilex Group", text: "Amazing communicator and photographer that captured every moment with a diligent and well trained eye. Will have him again with pleasure at any event." },
  { name: "Elizabeth Anderson", role: "Digital Poverty Alliance", text: "Booked at short notice for an evening event. Very responsive, professional, courteous and provided the photos quickly. The shots are lovely and just what we needed." },
  { name: "Ella Hoxha", role: "Newton Investment", text: "Incredible value for money. Professional, punctual and so artistic. We loved our photos so much." },
];
const PRICING = [
  {title: 'Short Coverage', price: '£350', duration: 'Up to 2 hours'},
  {title: 'Half Day Coverage', price: '£500', duration: 'Up to 4 hours'},
  {title: 'Full Day Coverage', price: '£800', duration: 'Up to 8 hours'},
];
const PRICING_INCLUDES = [
  '15-minute consultation and planning',
  '50 to 80 edited photos per hour',
  '3–5 business day delivery',
  'Print-ready high-resolution files',
  'Online gallery',
  'Full usage rights',
];
const PRICING_NOTE =
  'Extended coverage beyond 8 hours available at £100/hour. All photos include professional colour grading and lighting correction. Retouching (skin, object removal, compositing) quoted separately. Get in touch for a tailored quote.';

const CAL_LINK = "https://cal.com/YOUR_USERNAME";


// ── COMPONENTS ──────────────────────────────────────────────────────



function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function Lightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onPrev, onNext]);

  if (currentIndex === null || currentIndex === undefined) return null;
  const img = images[currentIndex];
  return (
    <div className="lightbox">
      <button className="lightbox-close" onClick={onClose}>✕</button>
      {images.length > 1 && (
        <>
          <button className="lightbox-arrow prev" onClick={(e) => { e.stopPropagation(); onPrev(); }}>‹</button>
          <button className="lightbox-arrow next" onClick={(e) => { e.stopPropagation(); onNext(); }}>›</button>
        </>
      )}
      <div className="lightbox-stage" onClick={onClose}>
        <div className="lightbox-image" style={{ background: img.color }} onClick={(e) => e.stopPropagation()}>
          {img.id}
        </div>
      </div>
      <div className="lightbox-counter">{currentIndex + 1} / {images.length}</div>
    </div>
  );
}

function HeroSlideshow({ slides }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);
  return (
    <>
      <div className="hero-slideshow">
        {slides.map((s, i) => (
          <div key={s.id} className={`hero-slide ${i === current ? "active" : ""}`} style={{ background: s.color }}>
            Hero image {s.id}
          </div>
        ))}
      </div>
      <div className="hero-overlay" />
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button key={i} className={`hero-dot ${i === current ? "active" : ""}`} onClick={() => setCurrent(i)} />
        ))}
      </div>
    </>
  );
}

// ── APP ─────────────────────────────────────────────────────────────
export default function App() {
  const [hovered, setHovered] = useState(false);
const [copied, setCopied] = useState(false);

const handleCopyEmail = () => {
  navigator.clipboard.writeText("contact@m90seven.uk.co");
  setCopied(true);
};

const handleMouseEnter = () => setHovered(true);

const handleMouseLeave = () => {
  setHovered(false);
  setCopied(false);
};
  const [theme, setTheme] = useState(CURRENT_THEME);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("galas");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [emailCopyStatus, setEmailCopyStatus] = useState(null);

  const images = GALLERY_IMAGES[activeCategory] || [];
  const themeVars = THEMES[theme];

  const themeStyle = {};
  Object.entries(themeVars).forEach(([k, v]) => {
    if (k.startsWith("--")) themeStyle[k] = v;
  });

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const closeLightbox = () => setLightboxIndex(null);
  const prevSlide = useCallback(() => {
    setLightboxIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  }, [images.length]);
  const nextSlide = useCallback(() => {
    setLightboxIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  return (
    <>
      <div className="app" style={themeStyle}>

        <nav className="navbar">
          <div className="nav-logo-container" style={{ cursor: "pointer" }} onClick={() => scrollTo("top")}>
            <img className="nav-logo"  src={logoWhite} alt="M90Seven" />
          </div>
          <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("galleries"); }}>Work</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("about"); }}>About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("testimonials"); }}>Reviews</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Contact</a>
            <button className="nav-btn" onClick={() => { setMenuOpen(false); setPricingOpen(true); }}>
              Transparent Pricing
            </button>
          </div>
        </nav>

        <section className="hero" id="top">
          <HeroSlideshow slides={HERO_SLIDES} />
          <div className="hero-content">
            <img className="hero-logo" src={logoWhite} alt="M90Seven" />
            <p>{themeVars.label} Event photography with empathy, precision and cinematic vision.</p>
            <a href="#" className="hero-cta" onClick={(e) => { e.preventDefault(); scrollTo("galleries"); }}>
              View Work
            </a>
          </div>
        </section>

        <div className="section" id="galleries">

          <div className="gallery-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                className={`tab ${activeCategory === cat.slug ? "tab-active" : ""}`}
                onClick={() => { setActiveCategory(cat.slug); setLightboxIndex(null); }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="gallery-grid">
            {images.map((img, idx) => (
              <div key={img.id} className="gallery-item" onClick={() => setLightboxIndex(idx)}>
                <div className="gallery-placeholder" style={{ background: img.color }}>{img.id}</div>
              </div>
            ))}
          </div>
        </div>

        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevSlide}
          onNext={nextSlide}
        />

        <div className="section" id="about">
          <div className="about-content">
            <div className="about-photo">Your Photo</div>
            <div className="about-text">
              <p>M90SEVEN is a London-based imaging studio specializing in high-impact event coverage, corporate storytelling, and strategic visual narratives. 
Founded by photographer and designer Julian Bektashi, the studio’s ethos is informed by multidisciplinary background in the arts and design, and delivers timeless, classically composed, cinematic images, with particular attention to atmosphere and ultimately the human element. </p>
              <p className="about-paragraph">Reliable, responsive, and trusted by corporate clients , charities and private hosts across London.</p>
            </div>
          </div>
        </div>

        <div className="section" id="testimonials">
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <blockquote key={i} className="testimonial-card">
                <p>"{t.text}"</p>
                <footer>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>

  <footer className="site-footer" id="contact">
          <div className="footer-grid">
            <div>
 <div
  className="email-wrapper"
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  onClick={handleCopyEmail}
  style={{ cursor: "pointer" }}
>
  <div className="pop-out-text">
    {hovered ? (copied ? "Copied! :)" : "Click to copy email") : "\u00A0"}
  </div>
  <div className="contact-email">contact@m90seven.uk.co</div>
</div>
              <p>Based in London, available UK-Wide.</p>
            </div>
            <div>
            </div>
            <div className="footer-social">
              <a href="#"><img className="social-icon" src={whatsapp_icon} alt="WhatsApp" /></a>
              <a href="#"><img className="social-icon" src={linkedin_icon} alt="LinkedIn" /></a>
            </div>
          </div>
          <p className="footer-copy">©2026 M90SEVEN Photography. Website by Betsu Works.</p>
        </footer>

       <Modal open={pricingOpen} onClose={() => setPricingOpen(false)}>
  <div className="pricing-grid">
    {PRICING.map((p, i) => (
      <div key={i} className="pricing-card">
        <h3>{p.title}</h3>
        <p className="pricing-price">{p.price}</p>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{p.duration}</p>
      </div>
    ))}
    <div className="pricing-card">
      <h3>All packages include</h3>
      <ul>{PRICING_INCLUDES.map((item, j) => <li key={j}>{item}</li>)}</ul>
    </div>
    <p className="pricing-note">{PRICING_NOTE}</p>
  </div>
</Modal>

        <Modal open={bookingOpen} onClose={() => setBookingOpen(false)} title="Book a Consultation">
          <div className="booking-content">
            <p>Choose a time for a free 15-minute consultation.</p>
            <a href={CAL_LINK} target="_blank" rel="noopener noreferrer" className="booking-link">
              Open Booking Calendar →
            </a>
          </div>
        </Modal>

        {/* DEV ONLY — remove in production */}
        <div className="theme-switcher">
          {Object.keys(THEMES).map((t) => (
            <button key={t} className={theme === t ? "ts-active" : ""} onClick={() => setTheme(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
