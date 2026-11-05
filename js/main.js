/**
 * AMJAD M.M — PORTFOLIO MAIN JAVASCRIPT
 * GSAP & ScrollTrigger Animations, Tactile Paper Interactions, Modals & Forms
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize GSAP plugins if available
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  // 0. LIQUID PREMIUM SMOOTH SCROLL (LENIS)
  initLiquidSmoothScroll(prefersReducedMotion);

  // 1. LOADER INITIALIZATION & TRANSITION
  initLoader(prefersReducedMotion);

  // 2. MAGNETIC BUTTON INTERACTIONS
  initMagneticButtons();

  // 3. 3D CARD TILT FOR PAPER ELEMENTS
  initPaperTilt();

  // 4. GITHUB CONTRIBUTION HEATMAP GENERATOR
  initHeatmap();

  // 5. COPY EMAIL FUNCTIONALITY & TOAST
  initCopyEmail();

  // 6. CONTACT FORM VALIDATION & SUBMISSION
  initContactForm();

  // 7. PROJECT PREVIEW MODAL
  initModals();

  // 8. MOBILE NAVIGATION DRAWER
  initMobileNav();

  // 9. SCROLL TRIGGER ANIMATIONS
  if (!prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    initScrollAnimations();
  }

  // 10. SCROLL-TRIGGERED 3D ORIGAMI PAPER UNFOLDING (GSAP + THREE.JS + HTML/CSS)
  initPaperUnfoldOnScroll(prefersReducedMotion);
  initThreeAboutBackground(prefersReducedMotion);

  // 11. ANIMATED BORDER PATROL PENGUIN
  initBorderPenguin(prefersReducedMotion);
});

/**
 * Liquid Premium Smooth Scroll Engine (Lenis + GSAP)
 * Delivers inertia momentum scrolling, liquid progress tracking, and velocity paper skew
 */
let lenisInstance = null;

function initLiquidSmoothScroll(prefersReducedMotion) {
  if (prefersReducedMotion || typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxurious exponential ease-out
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.05,
    touchMultiplier: 1.6,
    infinite: false,
  });

  lenisInstance = lenis;

  // Seamless GSAP ScrollTrigger Synchronization
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
  }

  if (typeof gsap !== 'undefined') {
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Liquid Scroll Progress Bar & Velocity Inertia Paper Skew
  const progressBar = document.getElementById('liquid-scroll-bar');
  const targetCards = document.querySelectorAll(
    '.paper-sheet-legal, .stack-card, .project-sub-card, .exp-card, .milestone-paper-note, .contributions-card'
  );

  lenis.on('scroll', ({ progress, velocity }) => {
    // 1. Dynamic Liquid Scroll Progress Bar
    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }

    // 2. Tactile Velocity-Based Paper Inertia Skew (Damped to +/-1.5deg)
    if (typeof gsap !== 'undefined' && targetCards.length > 0) {
      const targetSkew = Math.max(-1.5, Math.min(1.5, velocity * 0.04));
      // Only apply velocity skew to cards that are not currently folded shut
      const activeCards = Array.from(targetCards).filter((c) => {
        if (c.classList.contains('paper-unfold-sheet')) {
          return c.classList.contains('is-unfolded');
        }
        return true;
      });
      if (activeCards.length > 0) {
        gsap.to(activeCards, {
          skewY: targetSkew,
          duration: 0.35,
          ease: 'power1.out',
          overwrite: 'auto'
        });
      }
    }
  });

  // Smooth Anchor Navigation via Lenis
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, {
          offset: -66,
          duration: 1.3,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    });
  });
}

/**
 * Loader Sequence: AMJAD MM Wordmark reveal, progress bar, smooth curtain reveal
 */
function initLoader(prefersReducedMotion) {
  const loader = document.getElementById('loader');
  const progressBar = document.querySelector('.loader-progress-bar');
  const progressPercent = document.getElementById('loader-percentage');
  if (!loader || !progressBar) return;

  if (prefersReducedMotion) {
    loader.style.display = 'none';
    return;
  }

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 20) + 12;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      if (progressPercent) progressPercent.textContent = '100%';
      progressBar.style.width = '100%';

      // Smooth exit
      setTimeout(() => {
        if (typeof gsap !== 'undefined') {
          gsap.to(loader, {
            yPercent: -100,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
              loader.style.display = 'none';
              // Trigger hero entrance
              animateHeroEntrance();
            }
          });
        } else {
          loader.style.opacity = '0';
          setTimeout(() => (loader.style.display = 'none'), 400);
        }
      }, 250);
    } else {
      if (progressPercent) progressPercent.textContent = `${progress}%`;
      progressBar.style.width = `${progress}%`;
    }
  }, 40);
}

/**
 * Hero Entrance Animation
 */
function animateHeroEntrance() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline();

  tl.from('.hero-paper-stack', {
    y: 40,
    opacity: 0,
    rotation: -4,
    duration: 0.9,
    ease: 'power3.out'
  })
  .from('.hero-pill-tag', {
    scale: 0.8,
    opacity: 0,
    duration: 0.4,
    ease: 'back.out(1.7)'
  }, '-=0.5')
  .from('.hero-title .title-line', {
    y: 50,
    opacity: 0,
    stagger: 0.12,
    duration: 0.7,
    ease: 'power3.out'
  }, '-=0.3')
  .from('.hero-desc', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.3')
  .from('.tech-chip', {
    y: 15,
    opacity: 0,
    stagger: 0.05,
    duration: 0.4,
    ease: 'power2.out'
  }, '-=0.3')
  .from('.hero-ctas .btn-brutalist', {
    scale: 0.9,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5,
    ease: 'back.out(1.5)'
  }, '-=0.2');
}

/**
 * Magnetic Button Attraction
 */
function initMagneticButtons() {
  const magneticButtons = document.querySelectorAll('.btn-brutalist');
  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/**
 * 3D Paper Card Tilt Interaction
 */
function initPaperTilt() {
  const cards = document.querySelectorAll('.stack-card, .project-sub-card, .exp-card, .id-card-paper');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * Dynamic GitHub Heatmap Generator
 */
function initHeatmap() {
  const grid = document.getElementById('activity-heatmap');
  if (!grid) return;

  grid.innerHTML = '';
  const totalCells = 28 * 7; // 28 weeks, 7 days
  const levels = ['heat-cell', 'heat-cell heat-l1', 'heat-cell heat-l2', 'heat-cell heat-l3', 'heat-cell heat-l4'];

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    // create realistic clustering of commits
    const rand = Math.random();
    let levelClass = levels[0];
    let count = 0;

    if (rand > 0.82) {
      levelClass = levels[4];
      count = Math.floor(Math.random() * 8) + 12;
    } else if (rand > 0.65) {
      levelClass = levels[3];
      count = Math.floor(Math.random() * 6) + 7;
    } else if (rand > 0.42) {
      levelClass = levels[2];
      count = Math.floor(Math.random() * 4) + 3;
    } else if (rand > 0.25) {
      levelClass = levels[1];
      count = Math.floor(Math.random() * 2) + 1;
    }

    cell.className = levelClass;
    cell.title = count > 0 ? `${count} commits on this day` : 'No commits on this day';
    grid.appendChild(cell);
  }
}

/**
 * Copy Email to Clipboard & Toast
 */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast');
  const emailText = 'amjadmm127@gmail.com';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(emailText).then(() => {
      showToast('EMAIL COPIED TO CLIPBOARD!');
    }).catch(() => {
      showToast(`EMAIL: ${emailText}`);
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/**
 * Contact Form — Direct Dispatch to Gmail / Email Client
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const projectTypeSelect = document.getElementById('project-type');
  const messageInput = document.getElementById('message');
  const gmailBtn = document.getElementById('btn-submit-gmail') || form.querySelector('button[type="submit"]');
  const mailClientBtn = document.getElementById('btn-submit-default-mail');

  function getFormData() {
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const projectType = projectTypeSelect ? projectTypeSelect.value : 'General Inquiry';
    const message = messageInput ? messageInput.value.trim() : '';
    return { name, email, projectType, message };
  }

  function validate() {
    if (!nameInput || !nameInput.value.trim()) {
      if (nameInput) nameInput.focus();
      showToast('PLEASE ENTER YOUR NAME');
      return false;
    }
    if (!emailInput || !emailInput.value.trim() || !emailInput.checkValidity()) {
      if (emailInput) emailInput.focus();
      showToast('PLEASE ENTER A VALID EMAIL ADDRESS');
      return false;
    }
    if (!messageInput || !messageInput.value.trim()) {
      if (messageInput) messageInput.focus();
      showToast('PLEASE ENTER YOUR MESSAGE OR PROJECT DETAILS');
      return false;
    }
    return true;
  }

  function dispatchToGmail() {
    if (!validate()) return;

    const { name, email, projectType, message } = getFormData();
    const targetEmail = 'amjadmm127@gmail.com';
    const subject = `Portfolio Inquiry: [${projectType}] from ${name}`;
    const bodyText = 
      `Hi Muhammed Amjad,\n\n` +
      `I am reaching out regarding a project / opportunity:\n\n` +
      `• SENDER NAME: ${name}\n` +
      `• SENDER EMAIL: ${email}\n` +
      `• ENGAGEMENT TYPE: ${projectType}\n\n` +
      `• MESSAGE / PROJECT DETAILS:\n${message}\n\n` +
      `-----------------------------------------\n` +
      `Dispatched via Muhammed Amjad M.M Portfolio\n` +
      `Recipient: ${targetEmail}`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    const mailtoUrl = `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    // Show visual confirmation on the button
    const origHtml = gmailBtn.innerHTML;
    gmailBtn.innerHTML = '<span>OPENING GMAIL...</span> <span>✓</span>';
    gmailBtn.style.backgroundColor = '#10B981';
    gmailBtn.style.color = '#FFFFFF';
    showToast('OPENING GMAIL COMPOSE WITH YOUR INQUIRY DETAILS...');

    // Attempt opening Gmail Web Compose in a new window/tab
    const opened = window.open(gmailUrl, '_blank');
    if (!opened || opened.closed || typeof opened.closed === 'undefined') {
      // If popup blocker intervened or on mobile, fallback to mailto
      window.location.href = mailtoUrl;
    }

    setTimeout(() => {
      gmailBtn.innerHTML = origHtml;
      gmailBtn.style.backgroundColor = '';
      gmailBtn.style.color = '';
    }, 4500);
  }

  function dispatchToMailClient() {
    if (!validate()) return;

    const { name, email, projectType, message } = getFormData();
    const targetEmail = 'amjadmm127@gmail.com';
    const subject = `Portfolio Inquiry: [${projectType}] from ${name}`;
    const bodyText = 
      `Hi Muhammed Amjad,\n\n` +
      `I am reaching out regarding a project / opportunity:\n\n` +
      `• SENDER NAME: ${name}\n` +
      `• SENDER EMAIL: ${email}\n` +
      `• ENGAGEMENT TYPE: ${projectType}\n\n` +
      `• MESSAGE / PROJECT DETAILS:\n${message}\n\n` +
      `-----------------------------------------\n` +
      `Dispatched via Muhammed Amjad M.M Portfolio\n` +
      `Recipient: ${targetEmail}`;

    const mailtoUrl = `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    if (mailClientBtn) {
      const origHtml = mailClientBtn.innerHTML;
      mailClientBtn.innerHTML = '<span>LAUNCHING MAIL APP...</span> <span>✓</span>';
      showToast('LAUNCHING YOUR DEFAULT EMAIL APP...');
      window.location.href = mailtoUrl;

      setTimeout(() => {
        mailClientBtn.innerHTML = origHtml;
      }, 3500);
    } else {
      window.location.href = mailtoUrl;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    dispatchToGmail();
  });

  if (mailClientBtn) {
    mailClientBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dispatchToMailClient();
    });
  }
}

/**
 * Project Modals (Sole//Raw, Shamsul Imara, Alfathah Medcare, Resume)
 */
function initModals() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');
  if (!overlay || !closeBtn || !modalBody) return;

  const projectData = {
    'soleraw': {
      title: 'SOLE//RAW — SNEAKER COMMERCE STORE',
      category: 'FEATURED FULL-STACK PLATFORM',
      tag: 'ANGULAR // TYPESCRIPT // JSON SERVER',
      content: `
        <div style="font-family: var(--font-mono); font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.6;">
          <p style="margin-bottom: 1rem;"><strong>Architectural Overview:</strong> SOLE//RAW is a modern sneaker e-commerce platform featuring a distinctive Neo-Brutalist design. Built with Angular and TypeScript, the application delivers a complete shopping experience with responsive layouts and structured client-side state.</p>
          <div style="background: #FAFAFA; border: 1.5px solid #0E0E0E; padding: 1.25rem; margin-bottom: 1.25rem;">
            <h4 style="font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 0.5rem;">KEY FEATURES & ARCHITECTURE</h4>
            <ul style="list-style: square; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.4rem;">
              <li>Modern sneaker shopping experience with Neo-Brutalist design language.</li>
              <li>Dynamic product listing and comprehensive detailed product pages.</li>
              <li>Interactive shopping cart and user wishlist functionality.</li>
              <li>User authentication and personal account management.</li>
              <li>Full admin dashboard with product catalog and order management.</li>
              <li>Technologies: Angular, TypeScript, JavaScript, HTML5, CSS3, JSON Server.</li>
            </ul>
          </div>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="https://github.com/amjad-mm/E-Commerce-sneakers" target="_blank" rel="noopener" class="btn-brutalist btn-yellow btn-sm">VIEW GITHUB REPOSITORY ↗</a>
            <button class="btn-brutalist btn-black btn-sm" onclick="document.getElementById('modal-overlay').classList.remove('active')">CLOSE WINDOW</button>
          </div>
        </div>
      `
    },
    'shamsulimara': {
      title: 'SHAMSUL IMARA — WORKFORCE SOLUTIONS',
      category: 'COMMERCIAL CLIENT PROJECT (UAE)',
      tag: 'REACT // JAVASCRIPT // MODERN CSS',
      content: `
        <div style="font-family: var(--font-mono); font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.6;">
          <p style="margin-bottom: 1rem;"><strong>Project Overview:</strong> A production corporate website developed for Shamsul Imara, a premier UAE-based workforce solutions and recruitment business. The project establishes an authoritative digital presence and presents the company's staffing services through an intuitive, user-friendly experience.</p>
          <div style="background: #FAFAFA; border: 1.5px solid #0E0E0E; padding: 1.25rem; margin-bottom: 1.25rem;">
            <h4 style="font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 0.5rem;">KEY HIGHLIGHTS</h4>
            <ul style="list-style: square; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.4rem;">
              <li>Professional corporate web presence tailored for international B2B clients.</li>
              <li>Streamlined service presentation and inquiries for recruitment solutions.</li>
              <li>Fast asset loading, clean code structure, and cross-browser responsiveness.</li>
              <li>Technologies: React, JavaScript, HTML5, CSS3.</li>
            </ul>
          </div>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="https://www.shamsulimara.com/" target="_blank" rel="noopener" class="btn-brutalist btn-yellow btn-sm">VISIT LIVE WEBSITE ↗</a>
            <a href="https://github.com/amjad-mm/shamsulimara" target="_blank" rel="noopener" class="btn-brutalist btn-black btn-sm">VIEW REPO ↗</a>
          </div>
        </div>
      `
    },
    'alfathahmedcare': {
      title: 'ALFATHAH MEDCARE SERVICES',
      category: 'HEALTHCARE CLIENT PROJECT (UAE)',
      tag: 'REACT // JAVASCRIPT // RESPONSIVE UI',
      content: `
        <div style="font-family: var(--font-mono); font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.6;">
          <p style="margin-bottom: 1rem;"><strong>Project Overview:</strong> A specialized healthcare portal developed for Alfathah Medcare Services, a trusted UAE-based healthcare service provider. Designed to showcase the company's clinical services and provide patients with an accessible, seamless online experience.</p>
          <div style="background: #FAFAFA; border: 1.5px solid #0E0E0E; padding: 1.25rem; margin-bottom: 1.25rem;">
            <h4 style="font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 0.5rem;">KEY HIGHLIGHTS</h4>
            <ul style="list-style: square; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.4rem;">
              <li>Clear presentation of clinical healthcare services and patient offerings.</li>
              <li>Accessible, user-focused navigation optimized for mobile and desktop visitors.</li>
              <li>High-contrast readability and patient consultation inquiry access.</li>
              <li>Technologies: React, JavaScript, HTML5, CSS3.</li>
            </ul>
          </div>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="https://www.alfathahmedcare.com/" target="_blank" rel="noopener" class="btn-brutalist btn-yellow btn-sm">VISIT LIVE WEBSITE ↗</a>
            <a href="https://github.com/amjad-mm/test06" target="_blank" rel="noopener" class="btn-brutalist btn-black btn-sm">VIEW REPO ↗</a>
          </div>
        </div>
      `
    },
    'resume': {
      title: 'MUHAMMED AMJAD M.M — CURRICULUM VITAE',
      category: 'ENGINEERING DOSSIER // 2026',
      tag: 'ASPIRING FULL-STACK DEVELOPER',
      content: `
        <div style="font-family: var(--font-mono); font-size: 0.88rem; line-height: 1.6;">
          <div style="border-bottom: 2px solid #0E0E0E; padding-bottom: 1rem; margin-bottom: 1.25rem;">
            <h4 style="font-family: var(--font-display); font-size: 1.3rem;">MUHAMMED AMJAD M.M</h4>
            <p>Email: amjadmm127@gmail.com | Malappuram, Kerala, India | Open for Collaborations</p>
            <p>GitHub: github.com/amjad-mm | LinkedIn: linkedin.com/in/amjad-mm</p>
          </div>
          <div style="margin-bottom: 1.25rem;">
            <h5 style="font-family: var(--font-heading); font-size: 1rem; margin-bottom: 0.35rem; color: #EE2B2B;">CORE COMPETENCIES & STACK</h5>
            <p><strong>Frontend:</strong> Angular, React, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS.<br>
            <strong>Backend:</strong> C#, .NET / ASP.NET Core, Node.js, REST APIs, JSON Server.<br>
            <strong>Databases & Cloud:</strong> MongoDB, PostgreSQL, Microsoft Azure (Learning).<br>
            <strong>Tools & Workflow:</strong> Git, GitHub, Postman, VS Code, JetBrains Rider, Figma, Claude Code, Antigravity.</p>
          </div>
          <div style="margin-bottom: 1.25rem;">
            <h5 style="font-family: var(--font-heading); font-size: 1rem; margin-bottom: 0.35rem; color: #EE2B2B;">EXPERIENCE HIGHLIGHTS</h5>
            <p><strong>Full-Stack Development Intern</strong> — Bridgeon Skillversity (May 2026 – Present)<br>Developing frontend apps with Angular & TypeScript; expanding backend expertise with C# & .NET Core; building REST APIs and cloud foundations.</p>
            <p style="margin-top: 0.5rem;"><strong>Client Web Developer (Freelance)</strong> — Shamsul Imara & Alfathah Medcare (UAE)<br>Engineered and deployed production corporate websites for UAE-based workforce solutions and healthcare providers using React and modern CSS.</p>
          </div>
          <div style="margin-bottom: 1.25rem;">
            <h5 style="font-family: var(--font-heading); font-size: 1rem; margin-bottom: 0.35rem; color: #EE2B2B;">EDUCATION</h5>
            <p><strong>Bachelor of Computer Applications (BCA)</strong> — Jain University – Online (2026 – Present)<br>Undergraduate studies in software engineering, algorithms, and computing fundamentals.</p>
          </div>
          <div style="margin-bottom: 1.5rem;">
            <h5 style="font-family: var(--font-heading); font-size: 1rem; margin-bottom: 0.35rem; color: #EE2B2B;">MILESTONES & ACHIEVEMENTS</h5>
            <p>• <strong>LeetCode 50-Day Badge:</strong> Maintained daily consistency in algorithmic problem solving.<br>
            • <strong>Production Client Work:</strong> Deployed live production platforms for international businesses in the UAE.</p>
          </div>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <button class="btn-brutalist btn-yellow btn-sm" onclick="window.print()">PRINT / DOWNLOAD PDF 🖨</button>
            <button class="btn-brutalist btn-black btn-sm" onclick="document.getElementById('modal-overlay').classList.remove('active')">CLOSE</button>
          </div>
        </div>
      `
    }
  };

  document.querySelectorAll('[data-modal-target]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const data = projectData[targetId];
      if (!data) return;

      modalBody.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <span class="project-tag-badge">${data.category}</span>
          <h2 style="font-size: 1.8rem; margin-top: 0.4rem; margin-bottom: 0.2rem;">${data.title}</h2>
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: #71717A;">${data.tag}</span>
        </div>
        ${data.content}
      `;

      overlay.classList.add('active');
    });
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
    }
  });
}

/**
 * Mobile Navigation Drawer
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (!toggleBtn || !drawer) return;

  function setDrawerState(open) {
    const willOpen = open !== undefined ? open : !drawer.classList.contains('open');
    if (willOpen) {
      drawer.classList.add('open');
      toggleBtn.classList.add('is-active');
      toggleBtn.setAttribute('aria-expanded', 'true');
    } else {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setDrawerState();
  });

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setDrawerState(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      setDrawerState(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      setDrawerState(false);
    }
  });
}

/**
 * GSAP ScrollTrigger Animations for sections & paper cards
 */
function initScrollAnimations() {
  // Staggered reveals for section headers
  gsap.utils.toArray('.section-header').forEach((header) => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 35,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // Tech stack cards stagger
  gsap.from('.stack-card', {
    scrollTrigger: {
      trigger: '.stack-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 40,
    opacity: 0,
    stagger: 0.12,
    duration: 0.8,
    ease: 'power3.out'
  });

  // Selected work cards
  gsap.from('.featured-project-card', {
    scrollTrigger: {
      trigger: '.featured-project-card',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 50,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out'
  });

  gsap.from('.project-sub-card', {
    scrollTrigger: {
      trigger: '.secondary-projects-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out'
  });

  // Experience cards
  gsap.from('.exp-card', {
    scrollTrigger: {
      trigger: '.experience-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 45,
    opacity: 0,
    stagger: 0.12,
    duration: 0.8,
    ease: 'power3.out'
  });

  // Milestones timeline notes
  gsap.from('.milestone-paper-note', {
    scrollTrigger: {
      trigger: '.timeline-track',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    x: -30,
    opacity: 0,
    stagger: 0.18,
    duration: 0.7,
    ease: 'power3.out'
  });

  // Contributions & metrics
  gsap.from('.contributions-card', {
    scrollTrigger: {
      trigger: '.contributions-card',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  });

  // Contact section paper form
  gsap.from('.contact-form-paper', {
    scrollTrigger: {
      trigger: '.contact-section-wrapper',
      start: 'top 75%',
      toggleActions: 'play none none none'
    },
    y: 50,
    rotation: -2,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out'
  });
}

/**
 * Scroll-Triggered 3D Origami Paper Unfold Engine (GSAP + ScrollTrigger + HTML/CSS)
 * Detects when user scrolls to Section 01 (#about) and physically unfolds:
 * - #paper-legal (3-panel accordion legal document)
 * - #paper-index (2-panel quick dossier index card)
 * - #paper-memo (2-panel personal philosophy memo)
 */
function initPaperUnfoldOnScroll(prefersReducedMotion) {
  const paperCards = document.querySelectorAll('.paper-unfold-sheet');
  if (paperCards.length === 0) return;

  if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    paperCards.forEach((paper) => {
      paper.classList.remove('is-folded', 'is-unfolding');
      paper.classList.add('is-unfolded');
    });
    return;
  }

  // Prepare each sheet in clean folded state
  paperCards.forEach((paper) => {
    paper.classList.add('is-folded');
    paper.classList.remove('is-unfolded', 'is-unfolding');
  });

  // Master GSAP Timeline triggered when Section 01 reaches the viewport
  const unfoldTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#about',
      start: 'top 75%',
      once: true,
      onEnter: () => {
        paperCards.forEach((p) => {
          p.classList.add('is-unfolding');
        });
      }
    },
    onComplete: () => {
      paperCards.forEach((paper) => {
        paper.classList.remove('is-folded', 'is-unfolding');
        paper.classList.add('is-unfolded');
      });
      // Refresh ScrollTrigger so subsequent sections have exact layout offsets
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }
  });

  // 1. LEGAL DOCUMENT (.paper-sheet-legal): 3-Panel Accordion Unfold
  const legalPaper = document.getElementById('paper-legal');
  if (legalPaper) {
    unfoldTl.to(legalPaper, {
      maxHeight: 1800,
      rotateX: 0,
      rotateY: 0,
      y: 0,
      duration: 1.25,
      ease: 'power2.out'
    }, 0);

    const legalPanelMid = legalPaper.querySelector('.panel-middle');
    if (legalPanelMid) {
      unfoldTl.to(legalPanelMid, {
        rotateX: 0,
        opacity: 1,
        maxHeight: 600,
        duration: 1.05,
        ease: 'power3.out'
      }, 0.12);
    }

    const legalPanelBottom = legalPaper.querySelector('.panel-bottom');
    if (legalPanelBottom) {
      unfoldTl.to(legalPanelBottom, {
        rotateX: 0,
        opacity: 1,
        maxHeight: 800,
        duration: 1.15,
        ease: 'power3.out'
      }, 0.28);
    }

    const legalShadows = legalPaper.querySelectorAll('.crease-shadow-overlay');
    if (legalShadows.length > 0) {
      unfoldTl.to(legalShadows, {
        opacity: 0,
        duration: 0.85,
        ease: 'power1.out'
      }, 0.4);
    }
  }

  // 2. DOSSIER INDEX CARD (.index-card-yellow): 2-Panel Half Fold Unfold
  const indexCard = document.getElementById('paper-index');
  if (indexCard) {
    unfoldTl.to(indexCard, {
      maxHeight: 800,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 1,
      y: 0,
      duration: 1.15,
      ease: 'power2.out'
    }, 0.15);

    const indexPanelBottom = indexCard.querySelector('.panel-bottom');
    if (indexPanelBottom) {
      unfoldTl.to(indexPanelBottom, {
        rotateX: 0,
        opacity: 1,
        maxHeight: 450,
        duration: 1.0,
        ease: 'power3.out'
      }, 0.3);
    }

    const indexShadows = indexCard.querySelectorAll('.crease-shadow-overlay');
    if (indexShadows.length > 0) {
      unfoldTl.to(indexShadows, {
        opacity: 0,
        duration: 0.8,
        ease: 'power1.out'
      }, 0.42);
    }
  }

  // 3. WHITE MEMO CARD (.memo-card-white): 2-Panel Half Fold Unfold
  const memoCard = document.getElementById('paper-memo');
  if (memoCard) {
    unfoldTl.to(memoCard, {
      maxHeight: 800,
      rotateX: 0,
      rotateY: 0,
      rotateZ: -1,
      y: 0,
      duration: 1.15,
      ease: 'power2.out'
    }, 0.25);

    const memoPanelBottom = memoCard.querySelector('.panel-bottom');
    if (memoPanelBottom) {
      unfoldTl.to(memoPanelBottom, {
        rotateX: 0,
        opacity: 1,
        maxHeight: 450,
        duration: 1.0,
        ease: 'power3.out'
      }, 0.4);
    }

    const memoShadows = memoCard.querySelectorAll('.crease-shadow-overlay');
    if (memoShadows.length > 0) {
      unfoldTl.to(memoShadows, {
        opacity: 0,
        duration: 0.8,
        ease: 'power1.out'
      }, 0.5);
    }
  }
}

/**
 * Three.js Ambient 3D Origami Canvas
 * Subtle, high-performance WebGL background with gentle floating 3D paper shards
 * providing tangible material depth behind Section 01.
 */
function initThreeAboutBackground(prefersReducedMotion) {
  if (prefersReducedMotion || typeof THREE === 'undefined') return;

  const container = document.getElementById('about-three-canvas-container');
  const section = document.getElementById('about');
  if (!container || !section) return;

  let width = section.clientWidth;
  let height = section.clientHeight || 700;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 50;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);
  } catch (e) {
    return; // WebGL not available
  }

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xfffaed, 0.6);
  dirLight.position.set(20, 30, 40);
  scene.add(dirLight);

  // Floating Paper Origami Shards / Planes
  const shardsCount = 18;
  const shardsGroup = new THREE.Group();
  const colors = [0xFFE500, 0xFDFAF5, 0xEDE8DF, 0xE4E4E7, 0x18181B];

  const shardMeshes = [];
  for (let i = 0; i < shardsCount; i++) {
    const size = 2.5 + Math.random() * 4.5;
    // Origami triangle or folded quad geometry
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -size, -size * 0.6, 0,
      size, -size * 0.4, (Math.random() - 0.5) * 1.5,
      0, size * 0.8, (Math.random() - 0.5) * 1.5
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();

    const mat = new THREE.MeshLambertMaterial({
      color: colors[i % colors.length],
      side: THREE.DoubleSide,
      transparent: true,
      opacity: colors[i % colors.length] === 0x18181B ? 0.08 : 0.45
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 25
    );
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    mesh.userData = {
      rotX: (Math.random() - 0.5) * 0.008,
      rotY: (Math.random() - 0.5) * 0.008,
      floatSpeed: 0.006 + Math.random() * 0.008,
      floatOffset: Math.random() * Math.PI * 2
    };

    shardsGroup.add(mesh);
    shardMeshes.push(mesh);
  }
  scene.add(shardsGroup);

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Render loop only when section is visible
  let isVisible = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isVisible = entry.isIntersecting;
    });
  }, { threshold: 0.05 });
  observer.observe(section);

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // Subtle drift
    shardMeshes.forEach((mesh) => {
      mesh.rotation.x += mesh.userData.rotX;
      mesh.rotation.y += mesh.userData.rotY;
      mesh.position.y += Math.sin(elapsedTime * 1.5 + mesh.userData.floatOffset) * 0.02;
    });

    // Gentle camera parallax
    camera.position.x += (mouseX * 4 - camera.position.x) * 0.03;
    camera.position.y += (mouseY * 3 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  // Resize handling
  window.addEventListener('resize', () => {
    if (!section || !renderer) return;
    const newW = section.clientWidth;
    const newH = section.clientHeight || 700;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  });
}

/**
 * Continuous Hero Border Patrol & Playful Chase: Penguin & Polar Bear
 * Smoothly traverses the rectangular perimeter of .hero-card
 * with natural corner turns, galloping/waddling strides, and near-catch surges.
 */
function initBorderPenguin(prefersReducedMotion) {
  const penguin = document.getElementById('hero-penguin');
  const bear = document.getElementById('hero-polar-bear');
  const heroCard = document.querySelector('.hero-card');
  const heroSection = document.querySelector('.hero-section');
  const penguinBubble = document.getElementById('penguin-bubble');
  const bearBubble = document.getElementById('bear-bubble');
  if (!penguin || !heroCard || !heroSection) return;

  let currentDist = 80; // Start penguin along the top edge
  const speed = 76; // Base pixels per second for a lively, pleasant chase
  const R = 10; // Corner arc radius
  let isPaused = false;
  let lastTime = performance.now();
  const startTime = performance.now();

  const penguinQuips = [
    'NOOT NOOT! 🐧',
    'CAN\'T CATCH ME! ⚡',
    'TOO FAST FOR YA! 🚀',
    'GUARDING THE CODE! 🛡️',
    'TACTILE SPEED! 📜',
    'WADDLE WADDLE! ✨',
    'NICE TRY, BEAR! 💨'
  ];

  const bearQuips = [
    'WAIT UP! 🐻',
    'ALMOST GOT YOU! 🐾',
    'JUST WANNA PLAY! ❄️',
    'SO CLOSE! 🎯',
    'ROAAAAR! 💛',
    'BEST BUDS FOREVER! 🌟',
    'ONE MORE LAP! 🏃'
  ];

  let penguinQuipIdx = 0;
  let bearQuipIdx = 0;

  // Interactive Hover and Click: Penguin
  penguin.addEventListener('mouseenter', () => {
    isPaused = true;
    penguin.classList.add('paused');
    if (bear) bear.classList.add('paused');
    if (penguinBubble) {
      penguinBubble.textContent = penguinQuips[penguinQuipIdx % penguinQuips.length];
    }
  });

  penguin.addEventListener('mouseleave', () => {
    isPaused = false;
    penguin.classList.remove('paused');
    if (bear) bear.classList.remove('paused');
    lastTime = performance.now();
  });

  penguin.addEventListener('click', () => {
    penguinQuipIdx++;
    if (penguinBubble) {
      penguinBubble.textContent = penguinQuips[penguinQuipIdx % penguinQuips.length];
    }
    if (typeof gsap !== 'undefined') {
      gsap.to(penguin.querySelector('.penguin-body-wrapper'), {
        y: -10,
        duration: 0.16,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
      });
    }
  });

  // Interactive Hover and Click: Polar Bear
  if (bear) {
    bear.addEventListener('mouseenter', () => {
      isPaused = true;
      penguin.classList.add('paused');
      bear.classList.add('paused');
      if (bearBubble) {
        bearBubble.textContent = bearQuips[bearQuipIdx % bearQuips.length];
      }
    });

    bear.addEventListener('mouseleave', () => {
      isPaused = false;
      penguin.classList.remove('paused');
      bear.classList.remove('paused');
      lastTime = performance.now();
    });

    bear.addEventListener('click', () => {
      bearQuipIdx++;
      if (bearBubble) {
        bearBubble.textContent = bearQuips[bearQuipIdx % bearQuips.length];
      }
      if (typeof gsap !== 'undefined') {
        gsap.to(bear.querySelector('.bear-body-wrapper'), {
          y: -8,
          duration: 0.15,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out'
        });
      }
    });
  }

  // Calculate perimeter path point with rounded corners
  function getTrackPoint(dist, W, H, X0, Y0, radius) {
    const topLen = W - 2 * radius;
    const rightLen = H - 2 * radius;
    const bottomLen = W - 2 * radius;
    const leftLen = H - 2 * radius;
    const cornerLen = 0.5 * Math.PI * radius;
    const total = topLen + rightLen + bottomLen + leftLen + 4 * cornerLen;
    let d = ((dist % total) + total) % total;

    // 1. Top Edge (Left to Right)
    if (d < topLen) {
      return { x: X0 + radius + d, y: Y0, angle: 0 };
    }
    d -= topLen;

    // 2. Corner Top-Right (0deg -> 90deg)
    if (d < cornerLen) {
      const t = d / cornerLen;
      const theta = t * 0.5 * Math.PI;
      const cx = X0 + W - radius;
      const cy = Y0 + radius;
      return {
        x: cx + radius * Math.sin(theta),
        y: cy - radius * Math.cos(theta),
        angle: theta * (180 / Math.PI)
      };
    }
    d -= cornerLen;

    // 3. Right Edge (Top to Bottom)
    if (d < rightLen) {
      return { x: X0 + W, y: Y0 + radius + d, angle: 90 };
    }
    d -= rightLen;

    // 4. Corner Bottom-Right (90deg -> 180deg)
    if (d < cornerLen) {
      const t = d / cornerLen;
      const theta = t * 0.5 * Math.PI;
      const cx = X0 + W - radius;
      const cy = Y0 + H - radius;
      return {
        x: cx + radius * Math.cos(theta),
        y: cy + radius * Math.sin(theta),
        angle: 90 + theta * (180 / Math.PI)
      };
    }
    d -= cornerLen;

    // 5. Bottom Edge (Right to Left)
    if (d < bottomLen) {
      return { x: X0 + W - radius - d, y: Y0 + H, angle: 180 };
    }
    d -= bottomLen;

    // 6. Corner Bottom-Left (180deg -> 270deg)
    if (d < cornerLen) {
      const t = d / cornerLen;
      const theta = t * 0.5 * Math.PI;
      const cx = X0 + radius;
      const cy = Y0 + H - radius;
      return {
        x: cx - radius * Math.sin(theta),
        y: cy + radius * Math.cos(theta),
        angle: 180 + theta * (180 / Math.PI)
      };
    }
    d -= cornerLen;

    // 7. Left Edge (Bottom to Top)
    if (d < leftLen) {
      return { x: X0, y: Y0 + H - radius - d, angle: 270 };
    }
    d -= leftLen;

    // 8. Corner Top-Left (270deg -> 360deg)
    const t = d / cornerLen;
    const theta = t * 0.5 * Math.PI;
    const cx = X0 + radius;
    const cy = Y0 + radius;
    return {
      x: cx - radius * Math.cos(theta),
      y: cy - radius * Math.sin(theta),
      angle: 270 + theta * (180 / Math.PI)
    };
  }

  // Animation Frame Loop
  function tick(now) {
    if (!lastTime) lastTime = now;
    const delta = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    if (!isPaused && !prefersReducedMotion) {
      currentDist += speed * delta;
    }

    // Dynamic Chase Distance: occasional playful surges where bear almost catches penguin
    const chaseSeconds = (now - startTime) / 1000;
    const surge = Math.pow(Math.max(0, Math.sin(0.32 * chaseSeconds)), 2);
    const dynamicGap = 68 - 30 * surge + 6 * Math.sin(0.85 * chaseSeconds);
    const bearDist = currentDist - dynamicGap;

    // Measure relative to heroSection container
    const heroRect = heroSection.getBoundingClientRect();
    const cardRect = heroCard.getBoundingClientRect();
    const X0 = cardRect.left - heroRect.left;
    const Y0 = cardRect.top - heroRect.top;
    const W = cardRect.width;
    const H = cardRect.height;

    // 1. Position Penguin
    const ptPenguin = getTrackPoint(currentDist, W, H, X0, Y0, R);
    penguin.style.transform = `translate3d(${ptPenguin.x - 16}px, ${ptPenguin.y - 28}px, 0) rotate(${ptPenguin.angle}deg)`;
    penguin.style.setProperty('--p-angle', `${ptPenguin.angle}deg`);

    // 2. Position Chasing Polar Bear
    if (bear) {
      const ptBear = getTrackPoint(bearDist, W, H, X0, Y0, R);
      bear.style.transform = `translate3d(${ptBear.x - 19}px, ${ptBear.y - 26.5}px, 0) rotate(${ptBear.angle}deg)`;
      bear.style.setProperty('--b-angle', `${ptBear.angle}deg`);
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

