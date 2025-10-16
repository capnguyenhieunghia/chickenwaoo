// effect.js - hiệu ứng slider, testimonial, hamburger, scroll reveal, countdown
(function () {
  "use strict";

  /* ---------- Slider banner ---------- */
  const slides = document.querySelectorAll(".hero-slider .slide");
  const prevBtn = document.querySelector(".slider-prev");
  const nextBtn = document.querySelector(".slider-next");
  const dotsWrap = document.getElementById("slider-dots");
  let current = 0;
  let sliderInterval = null;
  const intervalTime = 4000;

  function createDots() {
    if (!dotsWrap) return;
    slides.forEach((s, idx) => {
      const btn = document.createElement("button");
      btn.setAttribute("aria-label", "slide-" + (idx + 1));
      btn.addEventListener("click", () => goToSlide(idx));
      dotsWrap.appendChild(btn);
    });
    updateDots();
  }
  function updateDots() {
    if (!dotsWrap) return;
    Array.from(dotsWrap.children).forEach((b, i) => {
      b.classList.toggle("active", i === current);
    });
  }
  function goToSlide(i) {
    slides[current].classList.remove("active");
    current = (i + slides.length) % slides.length;
    slides[current].classList.add("active");
    updateDots();
  }
  function nextSlide() { goToSlide(current + 1); }
  function prevSlide() { goToSlide(current - 1); }
  function startSlider() { stopSlider(); sliderInterval = setInterval(nextSlide, intervalTime); }
  function stopSlider() { if (sliderInterval) clearInterval(sliderInterval); sliderInterval = null; }

  // init slider
  if (slides.length) {
    slides[0].classList.add("active");
    createDots();
    startSlider();
    const hero = document.querySelector(".hero-slider");
    hero.addEventListener("mouseenter", stopSlider);
    hero.addEventListener("mouseleave", startSlider);
    if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); startSlider(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); startSlider(); });
  }

  /* ---------- Testimonial slider ---------- */
  const testiItems = document.querySelectorAll(".testi-slider .testi");
  let testiIndex = 0;
  let testiInterval = null;
  function showTesti(i) {
    testiItems.forEach((t, idx) => t.classList.toggle("active", idx === i));
  }
  function nextTesti() {
    if (!testiItems.length) return;
    testiIndex = (testiIndex + 1) % testiItems.length;
    showTesti(testiIndex);
  }
  if (testiItems.length) {
    showTesti(0);
    testiInterval = setInterval(nextTesti, 5000);
    const testiWrap = document.getElementById("testi-slider");
    testiWrap.addEventListener("mouseenter", () => clearInterval(testiInterval));
    testiWrap.addEventListener("mouseleave", () => (testiInterval = setInterval(nextTesti, 5000)));
  }

  /* ---------- Hamburger / menu mobile ---------- */
  const hamb = document.querySelector(".hamburger");
  const mainNav = document.querySelector(".main-nav");
  if (hamb && mainNav) {
    hamb.addEventListener("click", function () {
      hamb.classList.toggle("active");
      mainNav.classList.toggle("open");
    });
    // close on link click mobile
    mainNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      hamb.classList.remove("active");
      mainNav.classList.remove("open");
    }));
  }

  /* ---------- Scroll reveal (data-animate) ---------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".section1, .section2, .section3, .section4, .section5, .about-section, .testimonials").forEach(el => {
    el.setAttribute("data-animate", "");
    observer.observe(el);
  });

  /* ---------- Promo countdown demo ---------- */
  function startCountdown(targetElementId, secondsFromNow = 259200) { // mặc định 3 ngày
    const el = document.getElementById(targetElementId);
    if (!el) return;
    const endTime = Date.now() + secondsFromNow * 1000;
    function update() {
      const diff = Math.max(0, endTime - Date.now());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor(diff / (1000 * 60 * 60) % 24);
      const m = Math.floor(diff / (1000 * 60) % 60);
      const s = Math.floor(diff / 1000 % 60);
      el.textContent = `${d}d ${h}h ${m}m ${s}s`;
      if (diff <= 0) {
        el.textContent = "Đã kết thúc";
        clearInterval(timer);
      }
    }
    update();
    const timer = setInterval(update, 1000);
  }
  startCountdown("promo-countdown", 3 * 24 * 60 * 60); // 3 ngày demo

  /* ---------- Small UX: show menu card desc on tap (mobile) ---------- */
  document.querySelectorAll(".menu-card").forEach(card => {
    card.addEventListener("click", function (e) {
      // click lần 1: show desc, lần 2 sẽ theo link
      const desc = this.querySelector(".menu-desc");
      if (!desc) return;
      if (window.innerWidth <= 420) {
        if (desc.style.opacity === "1") {
          // follow link
          const a = this.querySelector("a");
          if (a) window.location.href = a.href;
        } else {
          desc.style.opacity = 1;
          setTimeout(() => desc.style.opacity = "", 3000);
        }
      }
    });
  });

  /* ---------- Header shrink on scroll ---------- */
  const header = document.querySelector(".header");
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const s = window.scrollY;
    if (s > 60) header.classList.add("shrink"); else header.classList.remove("shrink");
    lastScroll = s;
  });

  /* ---------- Pause auto sliders when user interacts via keyboard focus ---------- */
  document.addEventListener("focusin", (ev) => {
    if (ev.target.closest(".hero-slider")) stopSlider();
    if (ev.target.closest(".testi-slider") && testiInterval) clearInterval(testiInterval);
  });
  document.addEventListener("focusout", (ev) => {
    if (ev.target.closest(".hero-slider")) startSlider();
    if (ev.target.closest(".testi-slider")) testiInterval = setInterval(nextTesti, 5000);
  });

  /* ---------- Accessibility: keyboard controls for slider ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

})();
