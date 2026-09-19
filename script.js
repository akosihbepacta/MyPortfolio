/* ════ NAV scroll shadow ════ */
const mainNav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
    mainNav.style.boxShadow = window.scrollY > 40 ? '0 4px 0 var(--ground2), 0 8px 20px rgba(0,0,0,.5)' : '0 4px 0 var(--ground2)';
}, {
    passive: true
});

/* ════ Mobile menu ════ */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenu = document.getElementById('close-menu');
const menuLinks = document.querySelectorAll('.menu-link');

function openMobileMenu() {
    mobileMenu.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
}

function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
}

burger.addEventListener('click', (e) => {
    e.stopPropagation();

    if (mobileMenu.classList.contains('open')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
});

closeMenu.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMobileMenu();
});

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

/* Close menu when clicking outside */
document.addEventListener('click', (e) => {
    if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !burger.contains(e.target)
    ) {
        closeMobileMenu();
    }
});

/* Close menu when pressing ESC */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

/* ════ Star field for bonus stage ════ */
const bonusStars = document.getElementById('bonus-stars');
if (bonusStars) {
    for (let i = 0; i < 60; i++) {
        const s = document.createElement('div');
        s.className = 'bonus-star';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        s.style.animationDuration = (2 + Math.random() * 3) + 's';
        s.style.animationDelay = (Math.random() * 3) + 's';
        s.style.width = s.style.height = (Math.random() > .7 ? 3 : 2) + 'px';
        bonusStars.appendChild(s);
    }
}

/* ════ Cave dust particles ════ */
const caveParts = document.getElementById('cave-particles');
if (caveParts) {
    for (let i = 0; i < 18; i++) {
        const d = document.createElement('div');
        d.className = 'cave-dust';
        d.style.left = Math.random() * 100 + '%';
        d.style.animationDuration = (8 + Math.random() * 10) + 's';
        d.style.animationDelay = (Math.random() * 10) + 's';
        d.style.opacity = .3 + Math.random() * .4;
        caveParts.appendChild(d);
    }
}

/* ════ MARIO & Q-BLOCK INTERACTIVE ════ */
let coins = 0;
const mario = document.getElementById('mario');
const qBlock = document.getElementById('q-block');
const coinCountEl = document.getElementById('coin-count');
let hitCount = 0;
const MAX_HITS = 5;

function pad(n, l = 3) {
    return String(n).padStart(l, '0');
}

if (qBlock && mario) {
    qBlock.addEventListener('click', (e) => {
        if (qBlock.classList.contains('hit')) return;
        mario.classList.remove('mario-jumping');
        const blockRect = qBlock.getBoundingClientRect();
        const stageRect = document.getElementById('game-stage').getBoundingClientRect();
        const targetLeft = blockRect.left - stageRect.left + 2;
        mario.style.transition = 'left 0.2s ease';
        mario.style.left = targetLeft + 'px';
        mario.style.transform = 'translateY(-130px)';
        setTimeout(() => {
            coins += 100;
            hitCount++;
            coinCountEl.textContent = pad(coins);
            // Coin pop
            const c = document.createElement('div');
            c.className = 'coin-pop';
            c.style.left = (qBlock.offsetLeft + 13) + 'px';
            c.style.top = qBlock.offsetTop + 'px';
            document.getElementById('game-stage').appendChild(c);
            setTimeout(() => c.remove(), 650);
            // Score pop
            const s = document.createElement('div');
            s.className = 'score-pop';
            s.textContent = '+100';
            s.style.left = (qBlock.offsetLeft + 4) + 'px';
            s.style.top = (qBlock.offsetTop - 12) + 'px';
            document.getElementById('game-stage').appendChild(s);
            setTimeout(() => s.remove(), 850);
            // Block hit state
            if (hitCount >= MAX_HITS) {
                qBlock.classList.add('hit');
                qBlock.textContent = '';
            }
            // Return Mario
            mario.style.transform = 'translateY(0)';
            setTimeout(() => {
                mario.style.left = '10%';
                mario.classList.add('mario-jumping');
            }, 300);
        }, 230);
    });
}
/* ════ BUTTON CRACK PARTICLES ════ */
function spawnCrackParticles(btn) {
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const colors = ['#C84B0E', '#E86030', '#8B3300', '#FBD000', '#5A1E00'];
    for (let i = 0; i < 10; i++) {
        const p = document.createElement('div');
        p.className = 'crack-particle';
        const size = 3 + Math.random() * 5;
        const angle = (Math.PI * 2 / 10) * i + Math.random() * .5;
        const dist = 20 + Math.random() * 30;
        p.style.cssText = `
left:${cx}px; top:${cy}px;
width:${size}px; height:${size}px;
background:${colors[Math.floor(Math.random()*colors.length)]};
--dx:${Math.cos(angle)*dist}px;
--dy:${Math.sin(angle)*dist - 10}px;
animation-duration:${.35+Math.random()*.25}s;
animation-delay:${Math.random()*.05}s;
`;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 700);
    }
}
document.querySelectorAll('.pixel-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => spawnCrackParticles(btn));
    btn.addEventListener('click', () => spawnCrackParticles(btn));
    btn.addEventListener('touchstart', () => spawnCrackParticles(btn), {
        passive: true
    });
});
/* ════ SCROLL REVEAL ════ */
const revealEls = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver((entries) => {
    entries.forEach((e, idx) => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            ro.unobserve(e.target);
        }
    });
}, {
    threshold: 0.07,
    rootMargin: '0px 0px -30px 0px'
});
revealEls.forEach((el, i) => {
    el.style.transitionDelay = (i % 4 * 0.06) + 's';
    ro.observe(el);
});
/* ════ ACTIVE NAV + WORLD PROGRESS ════ */
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
const wpDots = document.querySelectorAll('.wp-dot');
// Map sections to worlds
const sectionWorldMap = {
    'hero': 'hero',
    'about': 'about',
    'cv': 'about',
    'skills': 'skills',
    'tools': 'skills',
    'projects': 'projects',
    'experience': 'experience',
    'services': 'experience',
    'why': 'experience',
    'contact': 'contact',
};
window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 140) cur = s.id;
    });
    navAs.forEach(a => a.classList.toggle('active-link', a.getAttribute('href') === '#' + cur));
    // Update world progress dots
    const worldKey = sectionWorldMap[cur] || 'hero';
    wpDots.forEach(dot => {
        dot.classList.toggle('wp-active', dot.dataset.section === worldKey);
    });
}, {
    passive: true
});
/* ════ PARALLAX EFFECT ════ */
const parallaxFar = document.getElementById('parallax-far');
const parallaxMid = document.getElementById('parallax-mid');
let ticking = false;
document.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        if (parallaxFar && parallaxMid) {
            const mx = (e.clientX / window.innerWidth - .5) * 20;
            const my = (e.clientY / window.innerHeight - .5) * 10;
            parallaxFar.style.transform = `translate(${mx*.4}px, ${my*.2}px)`;
            parallaxMid.style.transform = `translate(${mx*.7}px, ${my*.35}px)`;
        }
        ticking = false;
    });
});
/* ════ CONTACT FORM ════ */
document.getElementById('form-submit').addEventListener('click', () => {
    const fname = document.getElementById('fname').value.trim();
    const cemail = document.getElementById('cemail').value.trim();
    const message = document.getElementById('message').value.trim();
    const status = document.getElementById('form-status');
    if (!fname || !cemail || !message) {
        status.style.display = 'block';
        status.style.color = '#E52A2A';
        status.textContent = '⚠ Please fill in your name, email, and message.';
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cemail)) {
        status.style.display = 'block';
        status.style.color = '#E52A2A';
        status.textContent = '⚠ Please enter a valid email address.';
        return;
    }
    const btn = document.getElementById('form-submit');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    setTimeout(() => {
        status.style.display = 'block';
        status.style.color = '#42D142';
        status.textContent = '🏆 Message sent! Game Over — you reached the final castle. I\'ll be in touch soon.';
        btn.textContent = '✓ Message Sent!';
        document.querySelectorAll('#contact-form input, #contact-form textarea, #contact-form select').forEach(el => el.value = '');
    }, 1200);
});