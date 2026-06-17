(function () {
  'use strict';

  // ── Nav scroll ──────────────────────────────────────────────
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ── Mobile menu ─────────────────────────────────────────────
  var toggle = document.getElementById('navToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var links = document.querySelector('.nav__links');
      var open  = links.style.display === 'flex';
      links.style.cssText = open ? '' : 'display:flex;flex-direction:column;position:absolute;top:60px;left:0;right:0;background:rgba(5,13,26,0.97);padding:20px 24px;gap:20px;border-bottom:1px solid rgba(148,163,184,0.1)';
    });
  }

  // ── Typing demo animation ────────────────────────────────────
  var scenarios = [
    { text: 'john.smith@gmail.com',       verdict: 'allowed',  msg: '✓  Email looks good' },
    { text: 'test@testing.com',           verdict: 'blocked',  msg: '✕  Obvious test/placeholder email' },
    { text: 'user12345678@yahoo.com',     verdict: 'flagged',  msg: '⚠  Suspicious — excessive numbers' },
    { text: 'noreply@mailinator.com',     verdict: 'blocked',  msg: '✕  Disposable domain blocked' },
    { text: 'alice@ocuco.com',            verdict: 'allowed',  msg: '✓  Email looks good' },
    { text: 'qwerty123@tempmail.com',     verdict: 'blocked',  msg: '✕  Keyboard walk + disposable domain' },
  ];

  var typingEl  = document.getElementById('demoTyping');
  var verdictEl = document.getElementById('demoVerdict');
  var cursorEl  = document.getElementById('demoCursor');

  if (!typingEl) return;

  var idx      = 0;
  var charIdx  = 0;
  var deleting = false;
  var paused   = false;

  function tick() {
    var s = scenarios[idx];

    if (paused) return;

    if (!deleting && charIdx <= s.text.length) {
      typingEl.textContent = s.text.slice(0, charIdx);
      if (charIdx < s.text.length) {
        charIdx++;
        setTimeout(tick, 55 + Math.random() * 35);
      } else {
        // Finished typing — show verdict after short delay
        paused = true;
        setTimeout(function () {
          showVerdict(s.verdict, s.msg);
          setTimeout(function () {
            paused   = false;
            deleting = true;
            setTimeout(tick, 60);
          }, 2200);
        }, 400);
      }
    } else if (deleting && charIdx >= 0) {
      typingEl.textContent = s.text.slice(0, charIdx);
      if (charIdx > 0) {
        charIdx--;
        setTimeout(tick, 28);
      } else {
        deleting = false;
        clearVerdict();
        idx = (idx + 1) % scenarios.length;
        setTimeout(tick, 500);
      }
    }
  }

  function showVerdict(type, msg) {
    verdictEl.textContent  = msg;
    verdictEl.className    = 'demo-verdict demo-verdict--' + type;
  }
  function clearVerdict() {
    verdictEl.textContent = '';
    verdictEl.className   = 'demo-verdict';
  }

  setTimeout(tick, 800);

  // ── Smooth scroll for anchor links ──────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Intersection observer — fade-in on scroll ────────────────
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .layer-item, .integration-card, .pricing-card, .flow__step').forEach(function (el) {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });

  // ── Pricing Modal ────────────────────────────────────────────
  var PLANS = {
    starter: {
      badge:    'Starter',
      badgeCls: 'modal__badge--slate',
      title:    '3 Site License',
      subtitle: 'Perfect for individual developers & small projects',
      currency: '$',
      amount:   '99',
      period:   '/ year',
      url:      'https://checkout.freemius.com/plugin/32247/plan/52908/licenses/3/',
      features: [
        'Use on up to 3 WordPress sites',
        'All 6 detection layers (Syntax, Disposable, MX, SMTP, Behavior, Reputation)',
        'Real-time AJAX email validation',
        'Honeypot + timing bot detection',
        'All 7 form plugin integrations',
        'Full submission logs & CSV export',
        'Auto-updating disposable domain list',
        'Hard-block rules engine',
        'Email alerts on block events',
        '1 year of updates & support',
      ]
    },
    agency: {
      badge:    'Most Popular',
      badgeCls: 'modal__badge--indigo',
      title:    '50 Site License',
      subtitle: 'Built for agencies managing multiple client sites',
      currency: '$',
      amount:   '249',
      period:   '/ year',
      url:      'https://checkout.freemius.com/plugin/32247/plan/52909/licenses/50/',
      features: [
        'Use on up to 50 WordPress sites',
        'All 6 detection layers (Syntax, Disposable, MX, SMTP, Behavior, Reputation)',
        'Real-time AJAX email validation',
        'Honeypot + timing bot detection',
        'All 7 form plugin integrations',
        'Full submission logs & CSV export',
        'Auto-updating disposable domain list',
        'Hard-block rules engine',
        'Email alerts on block events',
        'Priority support',
        '1 year of updates & support',
      ]
    },
    lifetime: {
      badge:    'Best Value',
      badgeCls: 'modal__badge--emerald',
      title:    'Unlimited Lifetime License',
      subtitle: 'Unlimited sites, one payment — forever',
      currency: '$',
      amount:   '499',
      period:   'one-time',
      url:      'https://checkout.freemius.com/plugin/32247/plan/52910/licenses/unlimited/',
      features: [
        'Use on unlimited WordPress sites',
        'All 6 detection layers (Syntax, Disposable, MX, SMTP, Behavior, Reputation)',
        'Real-time AJAX email validation',
        'Honeypot + timing bot detection',
        'All 7 form plugin integrations',
        'Full submission logs & CSV export',
        'Auto-updating disposable domain list',
        'Hard-block rules engine',
        'Email alerts on block events',
        'Lifetime updates — pay once, own it forever',
        'Priority support',
      ]
    }
  };

  var overlay   = document.getElementById('pricingModal');
  var modalBody = document.getElementById('modalBody');

  function openModal(planKey) {
    var p = PLANS[planKey];
    if (!p || !overlay) return;

    modalBody.innerHTML =
      '<button class="modal__close" id="modalClose">&#x2715;</button>' +
      '<span class="modal__badge ' + p.badgeCls + '">' + p.badge + '</span>' +
      '<div class="modal__title">' + p.title + '</div>' +
      '<div class="modal__subtitle">' + p.subtitle + '</div>' +
      '<div class="modal__price-row">' +
        '<span class="modal__currency">' + p.currency + '</span>' +
        '<span class="modal__amount">' + p.amount + '</span>' +
        '<span class="modal__period">' + p.period + '</span>' +
      '</div>' +
      '<ul class="modal__features">' +
        p.features.map(function (f) { return '<li>' + f + '</li>'; }).join('') +
      '</ul>' +
      '<a href="' + p.url + '" target="_blank" rel="noopener" class="btn btn--primary btn--full" style="font-size:16px;padding:14px;justify-content:center;text-align:center" onclick="closeModal()">Complete Purchase →</a>' +
      '<p class="modal__note">Secure checkout powered by <a href="https://freemius.com" target="_blank" rel="noopener">Freemius</a> · 30-day money-back guarantee</p>';

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    document.getElementById('modalClose').addEventListener('click', closeModal);
  }

  function closeModal() {
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // Expose globally so onclick attributes work
  window.openModal  = openModal;
  window.closeModal = closeModal;

})();
