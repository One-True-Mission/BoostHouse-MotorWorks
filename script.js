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

  /* --- Calendly booking widget ---
     Note: Calendly's widget.js is loaded directly in book.html.
     The schedule button uses an inline onclick handler that calls
     Calendly.initPopupWidget directly. No JS needed here. */

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

  /* --- Philosophy video: autoplay 2s after scrolled into view --- */
  var philosophyVideo = document.getElementById('philosophy-video');
  if (philosophyVideo) {
    // When the video ends naturally, reset back to the poster image
    // (default browser behavior shows last frame, which is usually dark)
    philosophyVideo.addEventListener('ended', function () {
      philosophyVideo.currentTime = 0;
      philosophyVideo.load();
    });

    // Use IntersectionObserver to trigger autoplay 2 seconds after the
    // video scrolls into view
    if ('IntersectionObserver' in window) {
      var hasPlayed = false;
      var playTimer = null;

      var videoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !hasPlayed) {
            // Section is in view, start the 2-second countdown
            playTimer = setTimeout(function () {
              // Try to play; browsers require muted autoplay
              var playPromise = philosophyVideo.play();
              if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                  // Autoplay blocked by browser; do nothing, user can click play
                });
              }
              hasPlayed = true;
              videoObserver.unobserve(philosophyVideo);
            }, 2000);
          } else if (!entry.isIntersecting && playTimer && !hasPlayed) {
            // Visitor scrolled away before the 2s mark, cancel the timer
            clearTimeout(playTimer);
            playTimer = null;
          }
        });
      }, { threshold: 0.5 });

      videoObserver.observe(philosophyVideo);
    }
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