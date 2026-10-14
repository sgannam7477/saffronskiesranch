/* Saffron Skies Ranch — nav, lightbox, reveal, back-to-top */
document.addEventListener("DOMContentLoaded", () => {
  // Header shrink on scroll
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    header?.classList.toggle("scrolled", window.scrollY > 40);
    toTop?.classList.toggle("visible", window.scrollY > 500);
  };

  // Mobile drawer
  const burger = document.querySelector(".hamburger");
  const nav = document.querySelector(".main-nav");
  const overlay = document.querySelector(".nav-overlay");
  const closeNav = () => {
    nav?.classList.remove("open");
    burger?.classList.remove("active");
    overlay?.classList.remove("show");
    document.body.classList.remove("nav-locked");
  };
  burger?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.classList.toggle("active", open);
    overlay?.classList.toggle("show", open);
    document.body.classList.toggle("nav-locked", open);
  });
  overlay?.addEventListener("click", closeNav);
  nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeNav));

  // Back to top
  const toTop = document.querySelector(".to-top");
  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // Lightbox over every gallery image on the page
  const galleryImgs = [...document.querySelectorAll(".gallery-grid img")];
  if (galleryImgs.length) {
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&#10005;</button>
      <button class="lightbox-prev" aria-label="Previous">&#10094;</button>
      <img src="" alt="">
      <button class="lightbox-next" aria-label="Next">&#10095;</button>`;
    document.body.appendChild(lb);
    const lbImg = lb.querySelector("img");
    let idx = 0;
    const show = i => {
      idx = (i + galleryImgs.length) % galleryImgs.length;
      lbImg.src = galleryImgs[idx].src;
      lbImg.alt = galleryImgs[idx].alt;
    };
    galleryImgs.forEach((img, i) =>
      img.addEventListener("click", () => { show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; })
    );
    const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; };
    lb.querySelector(".lightbox-close").addEventListener("click", close);
    lb.querySelector(".lightbox-prev").addEventListener("click", () => show(idx - 1));
    lb.querySelector(".lightbox-next").addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", e => { if (e.target === lb) close(); });
    document.addEventListener("keydown", e => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }
});
