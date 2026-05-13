
import { useState, useEffect, useCallback } from "react";
import "./App.css";
import logoWhite from "./assets/M90SEVEN_LOGO_ABB_WHITE.png";
import iconWhite from "./assets/M90SEVEN_ICON_Mono_03_small.png";
import whatsapp_icon from "./assets/Whatsapp_Icon_BB.png";
import linkedin_icon from "./Assets/LinkedIn_Icon_BB.png";

/*
  PHOTOGRAPHY SITE — MULTI-BRAND SKELETON
  ========================================
  Two variants, one codebase:
    m90seven.events.co.uk     → theme="events"    (dark)
    m90seven.weddings.co.uk   → theme="weddings"  (light/white)

  CMS:   Cloudinary (free tier) — cloud name: dc598thou
  Book:  Cal.com (free tier)
  Build: Vite + React
*/

// ── CLOUDINARY CONFIG ───────────────────────────────────────────────
const CLOUD_NAME = "dc598thou";

async function fetchGallery(folder) {
  try {
    const res = await fetch(
      `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${folder}.json`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.resources
      .sort((a, b) => a.public_id.localeCompare(b.public_id))
      .map((r) => ({
        src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_90,f_auto/${r.public_id}`,
        thumb: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_800,q_auto,f_auto/${r.public_id}`,
        id: r.public_id,
      }));
  } catch {
    return [];
  }
}

// ── THEME CONFIG ────────────────────────────────────────────────────
const CURRENT_THEME = "events";

const THEMES = {
  events: {
    "--bg": "#111",
    "--bg-secondary": "#1a1a1a",
    "--nav-elements": "#000000",
    "--text": "#e8e8e8",
    "--text-muted": "#858585",
    "--border": "#ffffff",
    "--accent": "#fff",
    "--surface": "#1e1e1e",
    "--overlay": "rgba(0,0,0,0.85)",
    "--modal-bg": "#1a1a1a",
    "--nav-bg": "rgba(255, 255, 255, 0.95)",
    "--tab-inactive": "#ffffff",
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
};

// ── DATA ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { slug: "galas-awards", label: "Galas & Awards" },
  { slug: "conferences-panels", label: "Conferences & Panels" },
  { slug: "ceremonies-receptions", label: "Ceremonies & Receptions" },
];

const TESTIMONIALS = [
  { name: "Aneta Machyckova", role: "Google", headline: "Like movie frames", text: "His photos feel like movie frames, recreating each moment with a beautiful sense of wonder. Professional without being stiff, creative without overdoing it, and always goes the extra mile." },
  { name: "Milena Zeqo", role: "Essex Court Chambers", headline: "Consistently Reliable", text: "Full control of his craft, driven by a genuine passion for what he does. Highly professional, articulate, consistently reliable, and always delivers artistically brilliant images." },
  { name: "Lauren Carter", role: "Deka Chambers", headline: "Above and beyond", text: "Very attentive to our needs for a Silks Celebration, made sure every moment was beautifully captured. Went above and beyond to deliver stunning images, both elegant formal shots and intimate, candid moments." },
  { name: "Esmerjan Licaj", role: "UKAP Foundation", headline: "Breathtaking photos", text: "Incredibly responsive to our needs for a corporate gala, ensuring every detail was flawlessly captured. Delivered breathtaking photos — striking professional portraits and warm, spontaneous moments that truly brought the event to life." },
  { name: "Ambra Azizi", role: "OmniaMed Communications", headline: "Creative and full of ideas", text: "Creative and full of ideas. A fluid and authentic approach to capturing key moments across a variety of events, from professional networking to educational panels." },
  { name: "Driton Bilali", role: "Ilex Group", headline: "Diligent and well trained eye", text: "Amazing communicator and photographer that captured every moment with a diligent and well trained eye. Will have him again with pleasure at any event." },
  { name: "Elizabeth Anderson", role: "Digital Poverty Alliance", headline: "Responsive and professional", text: "Booked at short notice for an evening event. Very responsive, professional, courteous and provided the photos quickly. The shots are lovely and just what we needed." },
  { name: "Ella Hoxha", role: "Newton Investment", headline: "Punctual and professional", text: "Incredible value for money. Professional, punctual and so artistic. We loved our photos so much." },
];

const PRICING = [
  { title: "Short Coverage", price: "£300", duration: "Up to 2 hours" },
  { title: "Half Day Coverage", price: "£500", duration: "Up to 4 hours" },
  { title: "Full Day Coverage", price: "£800", duration: "Up to 8 hours" },
];

const PRICING_INCLUDES = [
  "Consultation and planning",
  "Minimum 30 edited photos per hour",
  "Same-day highlights on request",
  "Delivery within 1-3 business days",
  "Press-ready high-resolution files",
  "Secure online gallery",
  "Full usage rights",
];

const PRICING_NOTE = <>
  VAT not included. Extended coverage beyond 8 hours available at £100/hour. All photos include professional colour grading and lighting correction. Retouching (skin, object removal, compositing) quoted separately. <a href="mailto:contact@m90seven.co.uk"><b>Get in touch</b></a> for a tailored quote.
</>;

const CAL_LINK = "https://cal.com/YOUR_USERNAME";

const FAQS = [
  { q: "What types of events do you cover?", a: "Corporate galas, award ceremonies, conferences, panels, charity events, celebrations, and performing arts. If you're unsure whether your event is a fit, get in touch." },
  { q: "How far in advance should I book?", a: "As early as possible, but we also accommodate last-minute bookings when available. Get in touch and we'll confirm availability within 24 hours." },
  { q: "Do you have public liability insurance?", a: "Yes, fully insured with £5M public liability cover. Certificates available on request." },
  { q: "What happens if you're unwell or unavailable?", a: "In the unlikely event of an emergency, we will arrange a trusted replacement photographer or offer a full refund. Your event is always covered." },
  { q: "Can I request specific shots or a shot list?", a: "Absolutely. We welcome shot lists and will work with you during the planning stage to make sure nothing is missed." },
  { q: "How are photos delivered?", a: "Through a secure, password-protected online gallery. You'll receive a link within 5 business days. Same-day highlights available on request." },
  { q: "Can I use the photos for marketing and press?", a: "Yes. Full usage rights for marketing, PR, social media, and internal communications are included in every package." },
  { q: "Do you cover events outside London?", a: "Yes, available UK-wide. Travel costs may apply depending on location." },
  { q: "Do you do video coverage?", a: "No, we specialise in still photography. However, we can recommend trusted videographers for your needs." },
  
];

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
        <img
          src={img.src}
          alt=""
          className="lightbox-img"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="lightbox-counter">{currentIndex + 1} / {images.length}</div>
    </div>
  );
}

function HeroSlideshow({ slides }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <>
      <div className="hero-slideshow">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`hero-slide ${i === current ? "active" : ""}`}
            style={{ background: `url(${s.src}) center/cover no-repeat` }}
          />
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

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="section" id="faq">
      <h2 className="faq-h2">Frequently Asked Questions</h2>
      <div className="faq-list">
        {FAQS.map((item, i) => (
          <div key={i} className="faq-item">
            <button className="faq-question" onClick={() => toggle(i)}>
              <span>{item.q}</span>
              <span className="faq-icon">{openIndex === i ? "−" : "+"}</span>
            </button>
            <div className={`faq-answer ${openIndex === i ? "faq-open" : ""}`}>
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── APP ─────────────────────────────────────────────────────────────
export default function App() {
  // ── Form state ──
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // ── Email copy state ──
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── UI state ──
  const [theme, setTheme] = useState(CURRENT_THEME);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]?.slug || "galas-awards");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // ── Cloudinary: hero images ──
  const [heroImages, setHeroImages] = useState([]);
  useEffect(() => {
    fetchGallery("hero").then(setHeroImages);
  }, []);

  // ── Cloudinary: gallery images ──
  const [images, setImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  useEffect(() => {
    setGalleryLoading(true);
    fetchGallery(activeCategory).then((imgs) => {
      setImages(imgs);
      setGalleryLoading(false);
    });
  }, [activeCategory]);

  const [aboutPhoto, setAboutPhoto] = useState(null);

useEffect(() => {
  fetchGallery("about-photo").then((imgs) => {
    if (imgs.length > 0) setAboutPhoto(imgs[0].src);
  });
}, []);

  // ── Handlers ──
  const themeVars = THEMES[theme];
  const themeStyle = {};
  Object.entries(themeVars).forEach(([k, v]) => {
    if (k.startsWith("--")) themeStyle[k] = v;
  });

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@m90seven.co.uk");
    setCopied(true);
  };
  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => { setHovered(false); setCopied(false); };

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

        {/* ── Navbar ── */}
        <nav className="navbar">
          <div className="nav-logo-container" style={{ cursor: "pointer" }} onClick={() => scrollTo("top")}>
            <img className="nav-logo" src={iconWhite} alt="M90Seven" />
          </div>
          <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("galleries"); }}>Work</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("about"); }}>About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("testimonials"); }}>Reviews</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("faqs"); }}>FAQs</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Contact</a>
            <button className="nav-btn" onClick={() => { setMenuOpen(false); setPricingOpen(true); }}>
              Packages
            </button>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="hero" id="top">
          <HeroSlideshow slides={heroImages} />
          <div className="hero-content">
            <img className="hero-logo" src={logoWhite} alt="M90Seven" />
            <p>Event photography with empathy, precision and cinematic vision.</p>
            <a href="#" className="hero-cta" onClick={(e) => { e.preventDefault(); scrollTo("galleries"); }}>
              View Work
            </a>
          </div>
        </section>

        {/* ── Gallery ── */}
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
  {galleryLoading ? (
    Array.from({ length: 20 }).map((_, i) => (
      <div key={i} className="gallery-item gallery-skeleton" />
    ))
  ) : images.length === 0 ? (
    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", padding: "2rem 0" }}>
      No images yet
    </p>
  ) : (
    images.map((img, idx) => (
      <div key={img.id} className="gallery-item" onClick={() => setLightboxIndex(idx)}>
        <img src={img.thumb} alt="" loading="lazy" className="gallery-img" />
      </div>
    ))
  )}
</div>
        </div>

        {/* ── Lightbox ── */}
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevSlide}
          onNext={nextSlide}
        />

        {/* ── About ── */}
        <div className="section" id="about">
  <div className="about-content">
    {aboutPhoto ? (
      <img className="about-photo" src={aboutPhoto} alt="Julian Bektashi" />
    ) : (
      <div className="about-photo">Your Photo</div>
    )}
    <div className="about-text">
      <p>
        M90SEVEN is a London-based photography studio specialising in corporate
        events, galas, and high-profile occasions. Founded by photographer and
        designer Julian Bektashi, the studio brings a sharp artistic eye and a
        clear intent to every assignment — precise, discreet coverage that never
        misses a moment that matters.
      </p>
      <p>
        Every image is crafted for atmosphere, storytelling, and impact. Excellence
        is the standard. Reliability and client care are non-negotiable. We are a
        young studio, but our portfolio speaks for itself — world-class images
        delivered for leading corporate clients, charities, and private hosts
        across London.
      </p>
    </div>
  </div>
</div>

        {/* ── Testimonials ── */}
<div className="section" id="testimonials">
  <div className="testimonials-grid">
    {TESTIMONIALS.map((t, i) => (
  <blockquote key={i} className="testimonial-card">
  <h3 className="testimonial-headline">{t.headline}</h3>
  <p>"{t.text}"</p>
  <footer>
    <strong>{t.name}</strong>
    <span>{t.role}</span>
  </footer>
</blockquote>
    ))}
  </div>
  <a href="https://g.page/m90seven/review" target="_blank" rel="noopener noreferrer" className="google-reviews-link">
    See all reviews on Google
  </a>
</div>

        {/* ── FAQ ── */}
        <div id="faqs">
          <FAQ />
        </div>

        {/* ── Footer ── */}
<footer className="site-footer" id="contact">
  <div className="footer-main">

    <div className="footer-brand">
      <img className="footer-logo" src={logoWhite} alt="M90Seven" />
     <p>
  Event photography with empathy, precision and cinematic vision. We cover corporate galas, conferences, award ceremonies, and high-profile occasions across London and the UK. Our images don't just document events, they recreate the atmosphere, the tension, the quiet moments between the loud ones.
</p>

    </div>

<div className="footer-contact">
  <div
    className="email-wrapper"
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    onClick={handleCopyEmail}
    style={{ cursor: "pointer" }}
  >
    <div className="pop-out-text">
      {hovered ? (copied ? "Copied!" : "Click to copy") : "\u00A0"}
    </div>
    <div className="contact-email">contact@m90seven.co.uk</div>
  </div>
  <p></p>
  <p>Based in London, available UK-wide</p>
<div className="footer-social">
  <a href="#" className="social-link">
    <img className="social-icon-sm" src={linkedin_icon} alt="" />
    <span className="social-label">LinkedIn</span>
  </a>
  <a href="#" className="social-link">
    <img className="social-icon-sm" src={whatsapp_icon} alt="" />
    <span className="social-label">WhatsApp</span>
  </a>
</div>
</div>


  </div>

  <div className="footer-bottom">
    <p className="footer-copy">©2026 M90SEVEN PRODUCTIONS</p>
    <p className="footer-copy">Website by <a href="https://betsu.co.uk" target="_blank" rel="noopener noreferrer"><strong>Betsu Works</strong></a></p>
  </div>
</footer>

        {/* ── Pricing Modal ── */}
        <Modal
          open={pricingOpen}
          onClose={() => {
            setPricingOpen(false);
            setSelectedPackage(null);
            setFormData({ name: "", email: "", message: "" });
            setSent(false);
          }}
          title="Transparent Pricing"
        >
          {selectedPackage ? (
            <div className="enquiry-form">
              <button className="enquiry-back" onClick={() => { setSelectedPackage(null); setFormData({ name: "", email: "", message: "" }); setSent(false); }}>
                ← Back to packages
              </button>
              <h3>Enquiry: {selectedPackage.title}</h3>
              <p className="enquiry-subtitle">{selectedPackage.price} · {selectedPackage.duration}</p>
              {sent ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", padding: "1rem 0" }}>
                  Thank you! We'll be in touch within 24 hours.
                </p>
              ) : (
                <>
                  <input
                    type="text"
                    className="enquiry-input"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    type="email"
                    className="enquiry-input"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <textarea
                    className="enquiry-textarea enquiry-input"
                    placeholder="Tell us about your event (date, venue, any details)"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                  <button
                    className="enquiry-submit"
                    onClick={async () => {
                      setSending(true);
                      await fetch("https://api.web3forms.com/submit", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          access_key: "YOUR_WEB3FORMS_KEY",
                          subject: `Enquiry: ${selectedPackage.title} (${selectedPackage.price})`,
                          name: formData.name,
                          email: formData.email,
                          message: formData.message,
                        }),
                      });
                      setSending(false);
                      setSent(true);
                    }}
                    disabled={sending}
                  >
                    {sending ? "Sending..." : "Send Enquiry"}
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="pricing-grid">
              {PRICING.map((p, i) => (
                <div
                  key={i}
                  className="pricing-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedPackage(p)}
                >
                  <h3>{p.title}</h3>
                  <p className="pricing-price">{p.price}</p>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{p.duration}</p>
                </div>
              ))}
              <div className="pricing-card">
                <h3>All packages include</h3>
                <ul>{PRICING_INCLUDES.map((item, j) => <li key={j}>{item}</li>)}</ul>
              </div>
              <p className="pricing-note">{PRICING_NOTE}</p>
            </div>
          )}
        </Modal>

      </div>
    </>
  );
}
