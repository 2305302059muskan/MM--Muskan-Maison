/**
 * MM Muskan Maison — Floating Chatbot Widget
 * Wraps the Chatbase iframe in a custom premium UI.
 */
(function () {
    'use strict';

    /* ---------- Inject HTML ---------- */
    const widgetHTML = `
    <!-- Floating Chat Bubble -->
    <button id="mm-chat-bubble" aria-label="Open MM Maison Chat Assistant" aria-expanded="false">
      <i class="fas fa-comment-dots mm-bubble-icon"></i>
      <i class="fas fa-times mm-close-icon"></i>
      <span id="mm-chat-notif" aria-hidden="true"></span>
    </button>

    <!-- Chat Window -->
    <div id="mm-chat-window" role="dialog" aria-label="MM Chat Assistant" aria-hidden="true">
      <!-- Header -->
      <div id="mm-chat-header">
        <div class="mm-header-avatar">MM</div>
        <div class="mm-header-info">
          <div class="mm-header-name">Maison AI Assistant</div>
          <div class="mm-header-status">
            <span class="mm-status-dot"></span>
            <span class="mm-status-text">Online · Typically replies instantly</span>
          </div>
        </div>
        <button class="mm-header-close" id="mm-chat-close" aria-label="Close chat">
          <i class="fas fa-chevron-down"></i>
        </button>
      </div>

      <!-- Typing Indicator -->
      <div id="mm-typing-bar">
        <div class="mm-typing-avatar">MM</div>
        <div class="mm-typing-dots">
          <span></span><span></span><span></span>
        </div>
        <span class="mm-typing-label">Maison AI is typing…</span>
      </div>

      <!-- Chatbase Iframe -->
      <div id="mm-chat-iframe-wrap">
        <!-- iframe injected on first open -->
      </div>
    </div>
  `;

    // Inject into body
    const container = document.createElement('div');
    container.innerHTML = widgetHTML;
    document.body.appendChild(container);

    /* ---------- Elements ---------- */
    const bubble = document.getElementById('mm-chat-bubble');
    const chatWin = document.getElementById('mm-chat-window');
    const closeBtn = document.getElementById('mm-chat-close');
    const typingBar = document.getElementById('mm-typing-bar');
    const iframeWrap = document.getElementById('mm-chat-iframe-wrap');

    let isOpen = false;
    let iframeLoaded = false;
    let typingTimer = null;

    /* ---------- Typing Indicator Logic ---------- */
    function showTyping(duration) {
        typingBar.classList.remove('hidden');
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function () {
            typingBar.classList.add('hidden');
        }, duration);
    }

    /* ---------- Lazy Load iframe ---------- */
    function loadIframe() {
        if (iframeLoaded) return;
        iframeLoaded = true;

        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.chatbase.co/chatbot-iframe/9WCmaAjxbbAMDNok-9Yx9';
        iframe.title = 'MM Maison AI Chat Assistant';
        iframe.allow = 'microphone';
        iframe.setAttribute('loading', 'lazy');
        iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;';
        iframeWrap.appendChild(iframe);
    }

    /* ---------- Open / Close ---------- */
    function openChat() {
        isOpen = true;
        bubble.classList.add('is-open');
        chatWin.classList.add('is-visible');
        bubble.setAttribute('aria-expanded', 'true');
        chatWin.setAttribute('aria-hidden', 'false');

        // Load iframe on first open
        loadIframe();

        // Show typing indicator briefly
        showTyping(3200);
    }

    function closeChat() {
        isOpen = false;
        bubble.classList.remove('is-open');
        chatWin.classList.remove('is-visible');
        bubble.setAttribute('aria-expanded', 'false');
        chatWin.setAttribute('aria-hidden', 'true');
        clearTimeout(typingTimer);
        typingBar.classList.remove('hidden'); // reset for next open
    }

    function toggleChat() {
        if (isOpen) { closeChat(); } else { openChat(); }
    }

    /* ---------- Event Listeners ---------- */
    bubble.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', closeChat);

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen) closeChat();
    });

    // Close when clicking outside on mobile
    document.addEventListener('click', function (e) {
        if (isOpen &&
            !chatWin.contains(e.target) &&
            !bubble.contains(e.target)) {
            closeChat();
        }
    });

    /* ---------- Show notification dot after a delay ---------- */
    // (already visible by default via CSS; hide it after chat opened once)
    bubble.addEventListener('click', function () {
        const notif = document.getElementById('mm-chat-notif');
        if (notif) notif.style.display = 'none';
    }, { once: true });

})();
