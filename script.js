/* Boost House Motorworks - site JS */

document.addEventListener('DOMContentLoaded', function () {

  /* --- Active nav state --- */
  var currentPage = document.body.getAttribute('data-page');
  if (currentPage) {
    var navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(function (link) {
      if (link.getAttribute('data-link') === currentPage) {
        link.classList.add('is-active');
      }
    });
  }

  /* --- Hamburger toggle --- */
  var hamburger = document.querySelector('.hamburger');
  var navList = document.querySelector('.nav-links');
  if (hamburger && navList) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('is-open');
      navList.classList.toggle('is-open');
    });
    var mobileLinks = navList.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('is-open');
        navList.classList.remove('is-open');
      });
    });
  }

  /* --- Marquee seamless loop --- */
  var marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    var originalItems = marqueeTrack.innerHTML;
    marqueeTrack.innerHTML = originalItems + originalItems;
  }

  /* --- Calendly booking widget --- */
  /*
    Replace YOUR_CALENDLY_URL_HERE with your Calendly scheduling link.
    Example: https://calendly.com/boosthouse-motorworks/consultation
    Free tier works for one event type. Paid tier for multiple.
  */
  var calendlyUrl = 'YOUR_CALENDLY_URL_HERE';
  var bookingTarget = document.getElementById('calendly-inline');
  if (bookingTarget) {
    if (calendlyUrl && calendlyUrl.indexOf('calendly.com') !== -1) {
      // Load Calendly inline widget
      var script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.head.appendChild(script);

      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(link);

      bookingTarget.innerHTML =
        '<div class="calendly-inline-widget" data-url="' + calendlyUrl + '" style="min-width:320px;height:680px;"></div>';
    } else {
      // Fallback while Calendly is not yet configured
      bookingTarget.innerHTML =
        '<div class="booking-fallback">' +
          '<h3>Booking Coming Soon</h3>' +
          '<p>Our online booking system is being set up. For now, call us or send a message and we will get you on the schedule.</p>' +
          '<a href="tel:5123650672" class="btn btn-primary">Call (512) 365-0672</a>' +
        '</div>';
    }
  }

  /* --- Popup Calendly button (optional, used on other pages) --- */
  var popupButtons = document.querySelectorAll('[data-calendly-popup]');
  if (popupButtons.length && calendlyUrl && calendlyUrl.indexOf('calendly.com') !== -1) {
    var popupScript = document.createElement('script');
    popupScript.src = 'https://assets.calendly.com/assets/external/widget.js';
    popupScript.async = true;
    document.head.appendChild(popupScript);

    var popupLink = document.createElement('link');
    popupLink.rel = 'stylesheet';
    popupLink.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(popupLink);

    popupButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.Calendly && window.Calendly.initPopupWidget) {
          window.Calendly.initPopupWidget({ url: calendlyUrl });
        } else {
          window.location.href = 'book.html';
        }
      });
    });
  } else if (popupButtons.length) {
    // If no Calendly set, popup buttons just go to book page
    popupButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        if (btn.tagName !== 'A') {
          e.preventDefault();
          window.location.href = 'book.html';
        }
      });
    });
  }

  /* --- Scroll fade-in (subtle) --- */
  if ('IntersectionObserver' in window) {
    var fadeEls = document.querySelectorAll('.fade-in');
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(function (el) { obs.observe(el); });
  }

  /* --- Package Carousel --- */
  var carousels = document.querySelectorAll('.package-carousel');
  carousels.forEach(function (carousel) {
    var track = carousel.querySelector('.package-carousel-track');
    var cards = track ? track.querySelectorAll('.package-card') : [];
    var prevBtn = carousel.querySelector('.package-carousel-btn.prev');
    var nextBtn = carousel.querySelector('.package-carousel-btn.next');
    var dotsContainer = carousel.querySelector('.package-carousel-dots');
    if (!track || cards.length === 0) return;

    var currentIndex = 0;

    function getVisibleCount() {
      var w = window.innerWidth;
      if (w <= 560) return 1;
      if (w <= 900) return 2;
      if (w <= 1100) return 3;
      return 4;
    }

    function getMaxIndex() {
      return Math.max(0, cards.length - getVisibleCount());
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      var max = getMaxIndex();
      for (var i = 0; i <= max; i++) {
        var dot = document.createElement('button');
        dot.className = 'package-carousel-dot';
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', function (e) {
          var idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
          currentIndex = idx;
          update();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function update() {
      var visible = getVisibleCount();
      var max = getMaxIndex();
      if (currentIndex > max) currentIndex = max;
      if (currentIndex < 0) currentIndex = 0;

      var card = cards[0];
      var cardWidth = card.offsetWidth;
      var gap = 20;
      var offset = currentIndex * (cardWidth + gap);
      track.style.transform = 'translateX(-' + offset + 'px)';

      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= max;

      if (dotsContainer) {
        var dots = dotsContainer.querySelectorAll('.package-carousel-dot');
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === currentIndex);
        });
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        currentIndex--;
        update();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        currentIndex++;
        update();
      });
    }

    buildDots();
    update();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        buildDots();
        update();
      }, 150);
    });
  });

});
