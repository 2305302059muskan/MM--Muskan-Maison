/* ============================================
   MM – Muskan Maison | Main JavaScript
   ============================================ */

// ============================================
// CART STATE
// ============================================
let cart = JSON.parse(localStorage.getItem('mm_cart')) || [];

function saveCart() {
  localStorage.setItem('mm_cart', JSON.stringify(cart));
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const burger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger toggle
  if (burger) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }

  // Highlight active link
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ============================================
// CART SIDEBAR
// ============================================
function initCart() {
  const overlay   = document.getElementById('cartOverlay');
  const sidebar   = document.getElementById('cartSidebar');
  const openBtns  = document.querySelectorAll('.cart-btn');
  const closeBtn  = document.getElementById('cartClose');

  function openCart() {
    overlay.classList.add('open');
    sidebar.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCart();
  }

  function closeCart() {
    overlay.classList.remove('open');
    sidebar.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openCart));
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);

  updateCartCountBadge();
}

function updateCartCountBadge() {
  document.querySelectorAll('.cart-count').forEach(el => {
    const count = getCartCount();
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function addToCart(id, name, price, imgSrc) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, imgSrc, qty: 1 });
  }
  saveCart();
  updateCartCountBadge();
  renderCart();
  showToast(`✨  "${name}" added to cart`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartCountBadge();
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveCart();
  updateCartCountBadge();
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotalAmt');
  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
        </svg>
        <p>Your cart is empty</p>
        <p style="font-size:0.8rem;margin-top:0.4rem">Discover our collections and add something beautiful.</p>
      </div>`;
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.imgSrc}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>₹${item.price.toLocaleString('en-IN')}</p>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
          </div>
        </div>
        <button class="remove-item" onclick="removeFromCart('${item.id}')" title="Remove">✕</button>
      </div>`).join('');
  }

  if (cartTotal) {
    cartTotal.textContent = `₹${getCartTotal().toLocaleString('en-IN')}`;
  }
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================================
// FADE-IN ON SCROLL (INTERSECTION OBSERVER)
// ============================================
function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ============================================
// FAQ ACCORDION (Shipping page)
// ============================================
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      // Open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ============================================
// CONTACT FORM VALIDATION
// ============================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  function showError(id, msg) {
    const input = document.getElementById(id);
    const err   = document.getElementById(id + 'Error');
    if (input)  input.classList.add('error');
    if (err)  { err.textContent = msg; err.classList.add('show'); }
  }

  function clearError(id) {
    const input = document.getElementById(id);
    const err   = document.getElementById(id + 'Error');
    if (input) input.classList.remove('error');
    if (err)   err.classList.remove('show');
  }

  // Live clear on input
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => clearError(el.id));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    if (!name.value.trim()) {
      showError('name', 'Please enter your name.');
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
    }

    if (!subject || !subject.value.trim()) {
      showError('subject', 'Please select a subject.');
      valid = false;
    }

    if (!message.value.trim() || message.value.trim().length < 10) {
      showError('message', 'Please enter a message (at least 10 characters).');
      valid = false;
    }

    if (valid) {
      document.getElementById('successMsg').classList.add('show');
      form.reset();
      showToast('✉️  Message sent! We\'ll reply within 24 hours.');
      setTimeout(() => document.getElementById('successMsg').classList.remove('show'), 6000);
    }
  });
}

// ============================================
// SHOP FILTER (Shop page)
// ============================================
function initShopFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const products   = document.querySelectorAll('.product-card[data-category]');
  const countEl    = document.getElementById('shopCount');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;
      let visible = 0;

      products.forEach(card => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      if (countEl) countEl.textContent = `Showing ${visible} product${visible !== 1 ? 's' : ''}`;
    });
  });
}

// ============================================
// NEWSLETTER SUBSCRIBE (Footer)
// ============================================
function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input && input.value.trim()) {
        showToast('🌸  Thank you for subscribing!');
        input.value = '';
      }
    });
  });
}

// ============================================
// INIT ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCart();
  initFadeIn();
  initFAQ();
  initContactForm();
  initShopFilter();
  initNewsletter();
});
