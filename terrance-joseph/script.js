// Scroll Reveal — reveals elements as they enter the viewport.
// Built to fail safe: content is only ever hidden by CSS gated on the `.js`
// class (added in <head>), and this script guarantees a reveal pass on load,
// so a section can never stay permanently invisible.
(function () {
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  if (!reveals.length) return;

  const revealAll = () => reveals.forEach(el => el.classList.add('is-visible'));

  // Reveal anything currently in (or near) the viewport.
  const revealInView = () => {
    const trigger = window.innerHeight - 40;
    for (let i = reveals.length - 1; i >= 0; i--) {
      const el = reveals[i];
      if (el.classList.contains('is-visible')) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top < trigger && rect.bottom > 0) {
        el.classList.add('is-visible');
      }
    }
  };

  // Initial pass for content already on screen.
  revealInView();

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { revealInView(); ticking = false; });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', revealInView);

  // Final safety net: if anything is still hidden a moment after load
  // (e.g. layout shifts from late-loading fonts/images), reveal it.
  window.addEventListener('load', () => setTimeout(revealAll, 1200));
})();

// Active Nav Link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`nav a[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => navObserver.observe(section));

// Mobile Nav Toggle
const navToggle = document.getElementById('nav-toggle');
const navList = document.getElementById('nav-links');

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', navList.classList.contains('active'));
  });

  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navList.classList.remove('active'));
  });
}

// Smooth Scroll with nav offset
function smoothScrollTo(target) {
  const offset = 64;
  const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) { e.preventDefault(); smoothScrollTo(target); }
  });
});

// Photo Lightbox
document.querySelectorAll('.gallery-img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    if (!lightbox) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    const fig = img.closest('figure');
    const captionEl = fig ? fig.querySelector('.plate-typed, figcaption') : null;
    lightboxCaption.textContent = captionEl ? captionEl.textContent.trim() : (img.alt || '');
    lightbox.classList.add('active');
    document.body.classList.add('lightbox-open');
  });
});

const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightbox-close');

function closeLightbox() {
  if (lightbox) lightbox.classList.remove('active');
  document.body.classList.remove('lightbox-open');
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
