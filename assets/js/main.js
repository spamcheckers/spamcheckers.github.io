/* Email Spam Shield — site v2 motion layer */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('year').textContent = new Date().getFullYear();

  // ── Scroll progress bar + sticky nav state ────────────────────────
  var progress = document.getElementById('scrollProgress');
  var nav = document.getElementById('nav');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
    progress.style.width = (p * 100) + '%';
    nav.classList.toggle('is-stuck', (window.scrollY || h.scrollTop) > 20);
    parallax();
  }

  // ── Parallax (transform based on element center vs viewport) ───────
  var pxEls = [].slice.call(document.querySelectorAll('[data-parallax]'));
  function parallax() {
    if (reduce) return;
    var vh = window.innerHeight;
    pxEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var center = r.top + r.height / 2;
      var off = (center - vh / 2) / vh;              // -1 .. 1
      var k = parseFloat(el.getAttribute('data-parallax')) || 0;
      el.style.transform = 'translate3d(0,' + (off * k * 120).toFixed(1) + 'px,0)';
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  // ── Reveal on scroll ──────────────────────────────────────────────
  var reveal = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var d = parseInt(e.target.getAttribute('data-d') || '0', 10);
          e.target.style.transitionDelay = (d * 90) + 'ms';
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    reveal.forEach(function (el) { io.observe(el); });
  } else {
    reveal.forEach(function (el) { el.classList.add('is-in'); });
  }

  // ── Count-up stats ────────────────────────────────────────────────
  function fmt(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
    return String(n);
  }
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = fmt(target) + suffix; return; }
    var start = null, dur = 1400;
    function tick(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counts = [].slice.call(document.querySelectorAll('[data-count]'));
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counts.forEach(function (el) { cio.observe(el); });
  } else {
    counts.forEach(countUp);
  }

  // ── Engine scrollytelling ─────────────────────────────────────────
  var steps = [].slice.call(document.querySelectorAll('.step'));
  var layerEls = [].slice.call(document.querySelectorAll('.layers li'));
  var scenes = [].slice.call(document.querySelectorAll('.scene'));
  var sceneScore = document.getElementById('sceneScore');
  function scoreColor(v) { return v >= 60 ? '#f43f5e' : v >= 30 ? '#f59e0b' : '#6366f1'; }
  function setEngine(step) {
    var score = parseInt(step.getAttribute('data-score'), 10) || 0;
    var idx = parseInt(step.getAttribute('data-step'), 10) || 0;
    if (sceneScore) { sceneScore.textContent = score; sceneScore.style.color = scoreColor(score); }
    scenes.forEach(function (sc) { sc.classList.toggle('on', parseInt(sc.getAttribute('data-scene'), 10) === idx); });
    steps.forEach(function (s) { s.classList.toggle('active', s === step); });
    layerEls.forEach(function (l, i) { l.classList.toggle('on', i <= idx); });
  }
  if (steps.length) {
    if ('IntersectionObserver' in window) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) setEngine(e.target); });
      }, { threshold: 0.6, rootMargin: '-10% 0px -30% 0px' });
      steps.forEach(function (s) { sio.observe(s); });
    }
    setEngine(steps[0]);
  }

  // ── Freemius checkout ─────────────────────────────────────────────
  // Fill these from your Freemius dashboard: Settings → Keys for the
  // plugin ID + public key, and each plan's ID (Pricing → plan). Once set,
  // clicking a plan opens the real Freemius checkout; until then a small
  // info modal is shown.
  // Real Freemius product (Email Spam Shield, plugin 32247). Each plan maps to
  // its numeric Freemius plan ID; `url` is the hosted-checkout fallback used if
  // the Freemius checkout script hasn't loaded.
  var FREEMIUS = {
    pluginId: '32247',
    publicKey: 'pk_acbf9651f4555a9cd36a149d2a962',
    plans: {
      startup:  { planId: '52908', name: 'Startup',  price: '$49 / year',  sites: 'Up to 3 sites',  url: 'https://checkout.freemius.com/plugin/32247/plan/52908/' },
      agency:   { planId: '52909', name: 'Agency',   price: '$99 / year',  sites: 'Up to 50 sites', url: 'https://checkout.freemius.com/plugin/32247/plan/52909/' },
      lifetime: { planId: '52910', name: 'Lifetime', price: '$249 once',   sites: 'Unlimited sites', url: 'https://checkout.freemius.com/plugin/32247/plan/52910/' }
    }
  };
  var fsReady = FREEMIUS.pluginId && FREEMIUS.publicKey && window.FS && FS.Checkout;
  var fsHandler = fsReady ? new FS.Checkout({ plugin_id: FREEMIUS.pluginId, public_key: FREEMIUS.publicKey }) : null;

  var buyModal = document.getElementById('buyModal');
  var buyBody = document.getElementById('buyBody');
  function closeBuy() { if (buyModal) { buyModal.classList.remove('is-open'); document.body.style.overflow = ''; } }
  function openBuy(key) {
    var p = FREEMIUS.plans[key];
    if (!p) return;
    if (fsHandler) {                                   // embedded Freemius checkout
      fsHandler.open({ plan_id: p.planId, title: 'Email Spam Shield — ' + p.name, licenses: 1 });
      return;
    }
    if (p.url) {                                       // hosted-checkout fallback
      window.open(p.url, '_blank', 'noopener');
      return;
    }
    if (!buyModal) return;                              // fallback info modal
    buyBody.innerHTML =
      '<h3>' + p.name + ' — ' + p.price + '</h3>' +
      '<p>' + p.sites + '. Secure checkout via Freemius · 30-day money-back guarantee.</p>' +
      '<p class="buy-modal__note">Add your Freemius <code>pluginId</code>, <code>publicKey</code> and plan IDs in <code>assets/js/main.js</code> to enable one-click checkout.</p>' +
      '<button class="btn btn--primary btn--block" id="buyOk" type="button">Got it</button>';
    buyModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    var ok = document.getElementById('buyOk');
    if (ok) ok.addEventListener('click', closeBuy);
  }
  [].slice.call(document.querySelectorAll('.js-buy')).forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); openBuy(b.getAttribute('data-plan')); });
  });
  if (buyModal) {
    buyModal.addEventListener('click', function (e) { if (e.target === buyModal) closeBuy(); });
    var bc = document.getElementById('buyClose');
    if (bc) bc.addEventListener('click', closeBuy);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeBuy(); });
  }

  onScroll();
})();
