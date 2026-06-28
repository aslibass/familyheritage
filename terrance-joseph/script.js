// Scroll Reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

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
    const captionEl = img.closest('.gallery-item')?.querySelector('.gallery-caption');
    lightboxCaption.textContent = captionEl ? captionEl.textContent : '';
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
