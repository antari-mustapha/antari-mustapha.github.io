const langToggle = document.getElementById("langToggle");
const root = document.documentElement;
const html = document.documentElement;
const nav = document.getElementById("nav");

const STORAGE_KEY = "mustapha-antari-lang";

function setLanguage(lang) {
  if (lang === "ar") {
    html.setAttribute("lang", "ar");
    html.setAttribute("dir", "rtl");
    document.body.setAttribute("lang", "ar");
    document.body.setAttribute("dir", "rtl");
  } else {
    html.setAttribute("lang", "en");
    html.setAttribute("dir", "ltr");
    document.body.setAttribute("lang", "en");
    document.body.setAttribute("dir", "ltr");
  }
  localStorage.setItem(STORAGE_KEY, lang);
  applyTranslations(lang);
}


function applyTranslations(lang) {
  const isAr = lang === "ar";
  document.querySelectorAll("[data-en]").forEach((el) => {
    const arText = el.getAttribute("data-ar");
    const enText = el.getAttribute("data-en");
    if (arText) {
      el.textContent = isAr ? arText : enText;
    }
    const ariaAr = el.getAttribute("data-aria-ar");
    const ariaEn = el.getAttribute("data-aria-en");
    if (el.hasAttribute("aria-label") && ariaAr && ariaEn) {
      el.setAttribute("aria-label", isAr ? ariaAr : ariaEn);
    } else if (el.hasAttribute("aria-label") && arText && enText) {
      // keep as is
    }
  });
  // translate lang toggle
  const langEn = document.querySelector(".lang-toggle .lang-en");
  const langAr = document.querySelector(".lang-toggle .lang-ar");
  if (langEn && langAr) {
    langEn.textContent = isAr ? "English" : "العربية";
    langAr.textContent = isAr ? "English" : "EN";
  }
}



const saved = localStorage.getItem(STORAGE_KEY);
if (saved === "ar" || saved === "en") {
  setLanguage(saved);
} else {
  // default to English as specified in structure; keep LTR
  setLanguage("en");
}

langToggle.addEventListener("click", () => {
  const current = html.getAttribute("lang") === "ar" ? "ar" : "en";
  setLanguage(current === "ar" ? "en" : "ar");
});

// Mobile nav menu toggle
const navMenuBtn = document.getElementById("navMenuBtn");
const navLinks = document.getElementById("navLinks");

if (navMenuBtn && navLinks) {
  navMenuBtn.addEventListener("click", () => {
    const expanded = navMenuBtn.getAttribute("aria-expanded") === "true";
    navMenuBtn.setAttribute("aria-expanded", String(!expanded));
    navMenuBtn.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navMenuBtn.classList.remove("active");
      navLinks.classList.remove("active");
      navMenuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// Lightbox
const gallery = document.getElementById("galleryGrid");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCap = document.getElementById("lbCap");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");

let items = [];
let index = 0;

function refreshItems() {
  items = Array.from(document.querySelectorAll("#galleryGrid .g-item img"));
}

refreshItems();

gallery.addEventListener("click", (e) => {
  const fig = e.target.closest(".g-item");
  if (!fig) return;
  const img = fig.querySelector("img");
  if (!img) return;
  refreshItems();
  index = items.indexOf(img);
  if (index < 0) index = 0;
  openLightbox(img);
});

function openLightbox(img) {
  lbImg.src = img.src;
  lbImg.alt = img.alt || "";
  const fig = img.closest(".g-item");
  const isAr = html.getAttribute("lang") === "ar";
  const cap = fig?.dataset?.captionAr && isAr ? fig.dataset.captionAr : fig?.dataset?.captionEn || fig?.querySelector(".g-cap")?.textContent || "";
  lbCap.textContent = cap;
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

lbClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

lbNext.addEventListener("click", (e) => {
  e.stopPropagation();
  refreshItems();
  if (items.length === 0) return;
  index = (index + 1) % items.length;
  openLightbox(items[index]);
});

lbPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  refreshItems();
  if (items.length === 0) return;
  index = (index - 1 + items.length) % items.length;
  openLightbox(items[index]);
});

window.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") lbNext.click();
  if (e.key === "ArrowLeft") lbPrev.click();
});

// nav scroll shadow subtle
window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    nav.style.boxShadow = "0 30px 80px -50px rgba(24, 25, 38, 1)";
  } else {
    nav.style.boxShadow = "0 20px 60px -40px rgba(24, 25, 38, 0.9)";
  }
});

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
