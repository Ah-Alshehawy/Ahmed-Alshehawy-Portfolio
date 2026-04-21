// --- Language Switching Logic ---
(function () {
  const btnEn = document.getElementById('btn-en');
  const btnAr = document.getElementById('btn-ar');
  const enBlocks = document.querySelectorAll('.lang-en');
  const arBlocks = document.querySelectorAll('.lang-ar');

  function setLang(lang) {
    if (lang === 'ar') {
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
      btnAr.classList.add('active'); btnEn.classList.remove('active');
      arBlocks.forEach(el => el.classList.add('active'));
      enBlocks.forEach(el => el.classList.remove('active'));
      // toggle navbar brand
      const bEn = document.querySelector('.brand-en');
      const bAr = document.querySelector('.brand-ar');
      if (bEn) bEn.style.display = 'none';
      if (bAr) bAr.style.display = 'inline';
      // update nav links to Arabic targets/text
      document.querySelectorAll('.nav-link').forEach(a => {
        if (a.dataset.targetAr) a.href = a.dataset.targetAr;
        if (a.dataset.textAr) a.textContent = a.dataset.textAr;
      });
    } else {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
      btnEn.classList.add('active'); btnAr.classList.remove('active');
      enBlocks.forEach(el => el.classList.add('active'));
      arBlocks.forEach(el => el.classList.remove('active'));
      // toggle navbar brand
      const bEn = document.querySelector('.brand-en');
      const bAr = document.querySelector('.brand-ar');
      if (bEn) bEn.style.display = 'inline';
      if (bAr) bAr.style.display = 'none';
      // update nav links to English targets/text
      document.querySelectorAll('.nav-link').forEach(a => {
        if (a.dataset.targetEn) a.href = a.dataset.targetEn;
        if (a.dataset.textEn) a.textContent = a.dataset.textEn;
      });
    }
    try { localStorage.setItem('site-lang', lang); } catch (e) { }
  }

  btnEn.addEventListener('click', () => setLang('en'));
  btnAr.addEventListener('click', () => setLang('ar'));

  // initialize
  const saved = (function () { try { return localStorage.getItem('site-lang') } catch (e) { return null } })();
  // Use saved preference if present, otherwise default to English
  setLang(saved ? saved : 'en');
})();

// --- Scroll Reveal Logic ---
(function () {
  const items = document.querySelectorAll('.revealable');
  function reveal() {
    const h = window.innerHeight;
    items.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < h - 80) el.classList.add('reveal');
    });
  }
  window.addEventListener('scroll', reveal);
  window.addEventListener('resize', reveal);
  // initial
  setTimeout(reveal, 200);
})();

// --- Back to Top Logic ---
(function () {
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();

// --- Profile Image Animation ---
(function () {
  const wraps = document.querySelectorAll('.profile-wrap');
  wraps.forEach(w => {
    let animating = false;
    w.addEventListener('mouseenter', () => {
      if (animating) return;
      if (w.dataset.played === 'true') return; // don't re-run after one full play
      animating = true;
      w.classList.add('animate');
    });
    // listen for animation end on the cup image
    const cup = w.querySelector('.cup-image');
    if (cup) {
      cup.addEventListener('animationend', () => {
        // remove animate class to restore initial state
        w.classList.remove('animate');
        // ensure cup hidden and profile visible
        const prof = w.querySelector('.profile-image');
        if (prof) prof.style.opacity = '1';
        cup.style.opacity = '0';
        // mark as played once so it won't re-trigger without page refresh
        w.dataset.played = 'true';
        animating = false;
      });
    }
  });
})();

// --- Mobile Navigation Logic ---
(function () {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const navBackdrop = document.getElementById('navBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (hamburgerBtn && mobileNav && navBackdrop) {
    function toggleMobileNav() {
      hamburgerBtn.classList.toggle('active');
      mobileNav.classList.toggle('active');
      navBackdrop.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileNav() {
      hamburgerBtn.classList.remove('active');
      mobileNav.classList.remove('active');
      navBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    hamburgerBtn.addEventListener('click', toggleMobileNav);
    navBackdrop.addEventListener('click', closeMobileNav);

    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (!link.hasAttribute('target')) {
          closeMobileNav();
        }
      });
    });

    // Update mobile nav links based on language
    function updateMobileNavLinks() {
      const isArabic = document.documentElement.dir === 'rtl';
      const langLabel = document.querySelector('.mobile-lang-section .lang-label');

      mobileNavLinks.forEach(link => {
        const target = isArabic ? link.dataset.targetAr : link.dataset.targetEn;
        const text = isArabic ? link.dataset.textAr : link.dataset.textEn;
        if (target) link.href = target;
        if (text) link.textContent = text;
      });

      if (langLabel) {
        langLabel.textContent = isArabic ? 'اللغة' : 'Language';
      }
    }

    // Mobile language buttons
    const mobileBtnEn = document.getElementById('mobile-btn-en');
    const mobileBtnAr = document.getElementById('mobile-btn-ar');

    function syncLangButtons(lang) {
      if (mobileBtnEn && mobileBtnAr) {
        if (lang === 'ar') {
          mobileBtnAr.classList.add('active');
          mobileBtnEn.classList.remove('active');
        } else {
          mobileBtnEn.classList.add('active');
          mobileBtnAr.classList.remove('active');
        }
      }
    }

    // Observe language changes
    const observer = new MutationObserver(() => {
      updateMobileNavLinks();
      const currentLang = document.documentElement.lang;
      syncLangButtons(currentLang);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir', 'lang'] });

    // Initial update
    updateMobileNavLinks();
    syncLangButtons(document.documentElement.lang);

    // Connect mobile lang buttons to main lang switcher
    if (mobileBtnEn && mobileBtnAr) {
      mobileBtnEn.addEventListener('click', () => {
        const mainBtnEn = document.getElementById('btn-en');
        if (mainBtnEn) mainBtnEn.click();
        closeMobileNav();
      });
      mobileBtnAr.addEventListener('click', () => {
        const mainBtnAr = document.getElementById('btn-ar');
        if (mainBtnAr) mainBtnAr.click();
        closeMobileNav();
      });
    }
  }
})();

// --- Side Navigation Logic ---
(function () {
  const sideNav = document.getElementById('sideNav');
  const topNav = document.getElementById('topNav');
  if (sideNav && topNav) {
    const sideNavLinks = sideNav.querySelectorAll('a');
    let scrollTimeout;

    // Update side nav links based on language
    function updateSideNavLinks() {
      const isArabic = document.documentElement.dir === 'rtl';
      sideNavLinks.forEach(link => {
        const target = isArabic ? link.dataset.targetAr : link.dataset.targetEn;
        if (target) link.href = target;
      });
    }

    // Update on language change
    const observer = new MutationObserver(updateSideNavLinks);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });

    // Initial update
    updateSideNavLinks();

    // Smooth scroll visibility with debounce
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (window.scrollY > 150) {
          sideNav.classList.add('show');
          topNav.classList.add('hide');
        } else {
          sideNav.classList.remove('show');
          topNav.classList.remove('hide');
        }
      }, 100);
    });
  }
})();

// --- Certification Filter Logic ---
(function () {
  // English Tabs
  const tabsEn = document.querySelectorAll('#certTabs .cert-tab');
  const cardsEn = document.querySelectorAll('#certGrid .cert-card');
  tabsEn.forEach(tab => {
    tab.addEventListener('click', () => {
      tabsEn.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      cardsEn.forEach(card => {
        const cats = card.dataset.category || '';
        card.classList.toggle('hidden', filter !== 'all' && !cats.includes(filter));
      });
    });
  });

  // Arabic Tabs
  const tabsAr = document.querySelectorAll('#certTabsAr .cert-tab');
  const cardsAr = document.querySelectorAll('#certGridAr .cert-card');
  tabsAr.forEach(tab => {
    tab.addEventListener('click', () => {
      tabsAr.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filterAr;
      cardsAr.forEach(card => {
        const cats = card.dataset.categoryAr || '';
        card.classList.toggle('hidden', filter !== 'all' && !cats.includes(filter));
      });
    });
  });
})();
