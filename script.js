
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e){
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // collapse navbar on mobile
      const bsCollapse = document.querySelector('.navbar-collapse');
      if (bsCollapse && bsCollapse.classList.contains('show')) {
        new bootstrap.Collapse(bsCollapse).hide();
      }
    });
  });

  // Typewriter effect (reads data-text JSON array)
  function startTypewriter(el) {
    const arr = JSON.parse(el.dataset.text || '[]');
    if (!arr.length) return;
    let idx = 0, char = 0, forward = true;
    const delay = 70;
    function step() {
      const current = arr[idx];
      if (forward) {
        char++;
        el.textContent = current.slice(0, char);
        if (char === current.length) { forward = false; setTimeout(step, 1200); return; }
      } else {
        char--;
        el.textContent = current.slice(0, char);
        if (char === 0) { forward = true; idx = (idx + 1) % arr.length; }
      }
      setTimeout(step, delay);
    }
    step();
  }
  const tw = document.getElementById('typewriter');
  if (tw) startTypewriter(tw);

  // IntersectionObserver for sections fade-in & animate skill bars
  const sections = document.querySelectorAll('section, header.hero-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        // animate progress bars when skills visible
        if (entry.target.id === 'skills') animateSkillBars();
      }
    });
  }, { threshold: 0.12 });

  sections.forEach(s => observer.observe(s));

  function animateSkillBars(){
    document.querySelectorAll('#skills .progress-bar').forEach(pb => {
      const value = pb.dataset.progress || 0;
      pb.style.width = `${value}%`;
      pb.textContent = `${value}%`;
    });
  }

  // Back to top button
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) backToTop.style.display = 'flex';
    else backToTop.style.display = 'none';
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Copy email buttons
  const copyBtns = document.querySelectorAll('#copyEmailBtn, #copyEmailBtnBottom');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const email = document.getElementById('emailText')?.textContent || 'karan@example.com';
      try {
        await navigator.clipboard.writeText(email.trim());
        btn.classList.add('btn-success');
        btn.classList.remove('btn-outline-light','btn-outline-dark');
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.classList.remove('btn-success');
          btn.classList.add('btn-outline-light');
          btn.innerHTML = '<i class="bi bi-envelope-fill"></i> Email';
        }, 1400);
      } catch (err) {
        alert('Copy failed — please copy manually: ' + email);
      }
    });
  });

  // Contact form: open mail client with prefilled mailto (simple approach)
  const contactForm = document.getElementById('contactForm');
  const contactAlert = document.getElementById('contactAlert');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // simple validation
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        // show built-in invalid styles
        [name, email, message].forEach(i => {
          if (!i.value.trim()) i.classList.add('is-invalid'); else i.classList.remove('is-invalid');
        });
        return;
      }
      // prepare mailto
      const subject = encodeURIComponent(`Portfolio message from ${name.value.trim()}`);
      const body = encodeURIComponent(`${message.value.trim()}\n\nContact: ${name.value.trim()} — ${email.value.trim()}`);
      window.location.href = `mailto:karan@example.com?subject=${subject}&body=${body}`;
      contactAlert.classList.remove('d-none');
    });
  }

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    // toggle icon
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark')) {
      icon.className = 'bi bi-sun-fill';
    } else {
      icon.className = 'bi bi-moon-stars';
    }
  });

  // Set footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});