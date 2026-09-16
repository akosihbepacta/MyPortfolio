document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV scroll ── */
  const mainNav = document.getElementById('main-nav');
  if (mainNav) {
    window.addEventListener('scroll', () => {
      mainNav.style.boxShadow = window.scrollY > 40 
        ? '0 4px 0 #8B3300, 0 8px 20px rgba(0,0,0,.4)' 
        : '0 4px 0 #8B3300';
    });
  }

  /* ── Mobile menu ── */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMenu = document.getElementById('close-menu');
  const menuLinks = document.querySelectorAll('.menu-link');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => mobileMenu.classList.add('flex', 'open'));
    burger.addEventListener('click', () => mobileMenu.classList.remove('hidden'));
  }

  const hideMenu = () => {
    if (mobileMenu) {
      mobileMenu.classList.remove('flex', 'open');
      mobileMenu.classList.add('hidden');
    }
  };

  if (closeMenu) closeMenu.addEventListener('click', hideMenu);
  menuLinks.forEach(l => l.addEventListener('click', hideMenu));

  /* ── Brick tiles generation ── */
  const brickRow = document.getElementById('bricks-row');
  if (brickRow) {
    const n = Math.ceil(window.innerWidth / 56) + 4;
    for (let i = 0; i < n; i++) {
      const b = document.createElement('div');
      b.className = 'flex-1 h-[36px] bg-brick border-r-3 border-b-3 border-ground2 border-t-2 border-[#E86030]';
      brickRow.appendChild(b);
    }
  }

  /* ── INTERACTIVE GAME MECHANIC ── */
  let coins = 0;
  const mario = document.getElementById('mario');
  const qBlock = document.getElementById('q-block');
  const coinCountEl = document.getElementById('coin-count');

  if (qBlock && mario) {
    qBlock.addEventListener('click', (e) => {
      // Pause ambient jump
      mario.classList.remove('mario-jumping');

      // Animate Mario upward
      mario.style.transform = 'translateY(-120px)';

      setTimeout(() => {
        // Hit block feedback
        qBlock.classList.add('hit');
        coins += 1;
        if (coinCountEl) {
          coinCountEl.textContent = coins < 10 ? '0' + coins : coins;
        }

        // Create popped coin element
        const rect = qBlock.getBoundingClientRect();
        const stage = document.getElementById('game-stage');
        if (stage) {
          const stageRect = stage.getBoundingClientRect();

          const cPop = document.createElement('div');
          cPop.className = 'animate-coin-pop absolute w-5 h-5 bg-coin rounded-full border-3 border-coin2 pointer-events-none z-20';
          cPop.style.left = (rect.left - stageRect.left + 12) + 'px';
          cPop.style.top = (rect.top - stageRect.top - 10) + 'px';
          stage.appendChild(cPop);

          const sPop = document.createElement('div');
          sPop.className = 'animate-score-pop absolute font-pixel text-[0.45rem] text-coin pointer-events-none z-21';
          sPop.textContent = '+200';
          sPop.style.left = (rect.left - stageRect.left + 6) + 'px';
          sPop.style.top = (rect.top - stageRect.top - 20) + 'px';
          stage.appendChild(sPop);

          setTimeout(() => { cPop.remove(); sPop.remove(); }, 800);
        }

        // Return Mario & reset block state
        setTimeout(() => {
          mario.style.transform = 'translateY(0)';
          setTimeout(() => {
            mario.classList.add('mario-jumping');
            qBlock.classList.remove('hit');
          }, 300);
        }, 150);
      }, 150);
    });
  }

  /* ── SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));

  /* ── PROJECTS SLIDER ── */
  const track = document.getElementById('slider-track');
  const prevBtn = document.getElementById('sl-prev');
  const nextBtn = document.getElementById('sl-next');
  const dotsContainer = document.getElementById('slider-dots');
  const countEl = document.getElementById('slider-count');

  if (track && prevBtn && nextBtn) {
    const slides = Array.from(track.children);
    let currentIndex = 0;

    const getSlidesPerPage = () => {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    };

    let slidesPerPage = getSlidesPerPage();
    let maxIndex = Math.max(0, slides.length - slidesPerPage);

    const updateDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const totalPages = maxIndex + 1;
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = `sdot w-3 h-3 bg-panel2 border-2 border-[#5A3000] cursor-pointer transition-colors ${i === currentIndex ? 'bg-coin border-coin2' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    };

    const updateSlider = () => {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = 20; // 1.25rem = 20px
      track.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;
      
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex;

      if (countEl) {
        countEl.textContent = `${currentIndex + 1} / ${maxIndex + 1}`;
      }
      updateDots();
    };

    const goToSlide = (index) => {
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      updateSlider();
    };

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    window.addEventListener('resize', () => {
      slidesPerPage = getSlidesPerPage();
      maxIndex = Math.max(0, slides.length - slidesPerPage);
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      updateSlider();
    });

    updateSlider();
  }

  /* ── YOUTUBE MODAL ── */
  const ytModal = document.getElementById('yt-modal');
  const ytIframe = document.getElementById('yt-iframe');
  const ytModalTitle = document.getElementById('yt-modal-title');
  const ytModalDesc = document.getElementById('yt-modal-desc');
  const ytClose = document.getElementById('yt-modal-close');

  if (ytModal && ytIframe) {
    document.querySelectorAll('.yt-card').forEach(card => {
      card.addEventListener('click', () => {
        const vid = card.dataset.vid;
        const title = card.dataset.title;
        const desc = card.dataset.desc;

        if (ytModalTitle) ytModalTitle.textContent = title || '';
        if (ytModalDesc) ytModalDesc.textContent = desc || '';
        ytIframe.src = `https://www.youtube.com/embed/${vid}?autoplay=1`;

        ytModal.classList.remove('hidden');
        ytModal.classList.add('flex', 'open');
      });
    });

    const closeYtModal = () => {
      ytModal.classList.remove('flex', 'open');
      ytModal.classList.add('hidden');
      ytIframe.src = '';
    };

    if (ytClose) ytClose.addEventListener('click', closeYtModal);
    ytModal.addEventListener('click', (e) => {
      if (e.target === ytModal) closeYtModal();
    });
  }

  /* ── CONTACT FORM ── */
  const formSubmit = document.getElementById('form-submit');
  const formStatus = document.getElementById('form-status');

  if (formSubmit && formStatus) {
    formSubmit.addEventListener('click', () => {
      formStatus.style.display = 'block';
      formStatus.classList.remove('hidden');
      formStatus.textContent = 'Message sent! Thanks for reaching out.';
      setTimeout(() => {
        formStatus.style.display = 'none';
        formStatus.classList.add('hidden');
      }, 5000);
    });
  }

});