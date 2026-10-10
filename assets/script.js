/* ============================================================
   VIKRAM MULIK — PORTFOLIO
   Modules:
   1  Helpers
   2  Theme (dark)
   3  Mobile nav
   4  Scroll reveal + scrollspy + back-to-top
   5  Typewriter terminal
   6  Count-up stats
   7  Hero mouse tilt
   8  Particle canvas
   ============================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ---------- 2. Theme (dark) ---------- */
(() => {
  document.documentElement.dataset.theme = 'dark';
  try {
    localStorage.removeItem('theme');
  } catch (_) {
    /* ignore */
  }
})();

/* ---------- 3. Mobile nav ---------- */
(() => {
  const menu = $('#menu');
  const nav = $('#navLinks');

  const close = () => {
    nav?.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  };

  menu?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open', window.innerWidth <= 960);
    menu.setAttribute('aria-expanded', String(open));
  });

  nav?.addEventListener('click', (e) => {
    if (e.target.closest('a')) close();
  });
})();

/* ---------- 4. Reveal + scrollspy + back-to-top ---------- */
(() => {
  const revealEls = $$('.reveal');
  const toTop = $('#backToTop');
  const sections = $$('main section[id]');
  const navAnchors = $$('#navLinks a');
  const progressBar = $('#progressBar');
  const navHeader = $('.nav');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;

    if (toTop) {
      const show = y > 600;
      toTop.classList.toggle('show', show);
      toTop.setAttribute('aria-hidden', String(!show));
    }

    if (progressBar && max > 0) {
      progressBar.style.width = `${(y / max) * 100}%`;
    }

    if (navHeader) {
      navHeader.classList.toggle('scrolled', y > 24);
    }

    const current = sections
      .filter((s) => s.offsetTop - 140 <= y)
      .pop();
    if (current) {
      navAnchors.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === `#${current.id}`);
      });
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
})();

/* ---------- 5. Typewriter terminal ---------- */
(() => {
  const line = $('#typeLine');
  if (!line || prefersReducedMotion) {
    if (line) line.textContent = 'terraform apply --auto-approve';
    return;
  }

  const commands = [
    'terraform apply --auto-approve',
    'kubectl rollout status deploy/app',
    'helm upgrade prod --recreate-pods',
    'gitops: sync complete ✓',
    'akv get secret --name deploy-key',
    'infra as code: 95% automated',
  ];
  let cmdIdx = 0;
  let charIdx = 0;
  let deleting = false;

  const type = () => {
    const current = commands[cmdIdx];
    if (!deleting) {
      charIdx++;
      line.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1900);
        return;
      }
      setTimeout(type, 70 + Math.random() * 50);
    } else {
      charIdx--;
      line.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        cmdIdx = (cmdIdx + 1) % commands.length;
        setTimeout(type, 600);
        return;
      }
      setTimeout(type, 32);
    }
  };

  setTimeout(type, 900);
})();

/* ---------- 6. Count-up stats ---------- */
(() => {
  const items = $$('.stats b[data-count]');
  if (!items.length) return;

  const animate = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animate(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  items.forEach((el) => obs.observe(el));
})();

/* ---------- 8. Hero mouse tilt ---------- */
(() => {
  const visual = $('.hero-visual');
  if (!visual || prefersReducedMotion) return;

  const card = visual.querySelector('.infinity-card');
  const strength = 7;

  const onMove = (e) => {
    const rect = visual.getBoundingClientRect();
    if (rect.width === 0) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    if (card) {
      card.style.transform = `perspective(900px) rotateY(${px * strength}deg) rotateX(${py * -strength}deg)`;
    }
  };

  const onLeave = () => {
    if (card) card.style.transform = 'perspective(900px) rotateY(-5deg)';
  };

  visual.addEventListener('mousemove', onMove);
  visual.addEventListener('mouseleave', onLeave);
})();

/* ---------- 9. Particle canvas ---------- */
(() => {
  const canvas = $('#bgCanvas');
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let raf = 0;
  let particles = [];
  const COUNT = 60;
  const connectionDist = 130;

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };

  const create = () => {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < connectionDist) {
          ctx.strokeStyle = `rgba(139,92,246,${(1 - d / connectionDist) * 0.16})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34,211,238,0.5)';
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  };

  const stop = () => cancelAnimationFrame(raf);
  const start = () => {
    resize();
    create();
    draw();
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (!raf) {
      raf = requestAnimationFrame(draw);
    }
  });

  window.addEventListener('resize', resize);

  const initWhenIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 300));
  initWhenIdle(start);
})();

/* Year in footer */
$('#year').textContent = new Date().getFullYear();
