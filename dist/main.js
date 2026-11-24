const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const narrowScreen = window.matchMedia('(max-width: 800px)');

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  navigation.classList.toggle('is-open', open);
}

menuButton.hidden = false;
document.querySelector('.site-header').classList.add('has-mobile-menu');
menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') === 'false');
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a') && narrowScreen.matches) {
    setMenu(false);
    const section = document.querySelector(event.target.closest('a').hash);
    if (section) {
      section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
    }
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});
narrowScreen.addEventListener('change', () => setMenu(false));

const emailLink = document.querySelector('#email-address');
const email = emailLink.textContent.trim();
const letterForm = document.querySelector('#letter-form');
const topic = document.querySelector('#topic');
const message = document.querySelector('#message');

letterForm.hidden = false;
letterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = message.value.trim();
  if (!text) {
    message.setCustomValidity('Введите текст сообщения.');
    message.reportValidity();
    return;
  }

  const subject = topic.value.trim() || 'Запрос с сайта «Киввер-1»';
  const body = text.replace(/\r?\n/g, '\r\n');
  window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject)
    + '&body=' + encodeURIComponent(body);
});
message.addEventListener('input', () => message.setCustomValidity(''));

for (const link of document.querySelectorAll('[data-topic]')) {
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    topic.value = link.dataset.topic;
    topic.focus({ preventScroll: true });
  });
}

const copyButton = document.querySelector('#copy-email');
const copyFeedback = document.querySelector('#copy-feedback');
let feedbackTimeout;
copyButton.hidden = false;
copyButton.addEventListener('click', async () => {
  window.clearTimeout(feedbackTimeout);
  try {
    await navigator.clipboard.writeText(email);
    copyFeedback.textContent = 'Адрес скопирован';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(emailLink);
    selection.removeAllRanges();
    selection.addRange(range);
    copyFeedback.textContent = 'Адрес выделен для копирования';
  }
  feedbackTimeout = window.setTimeout(() => { copyFeedback.textContent = ''; }, 3500);
});

const portLinks = [...document.querySelectorAll('[data-port]')];
for (const link of portLinks) {
  const connect = () => {
    for (const portLink of portLinks) {
      portLink.classList.toggle('is-linked', portLink.dataset.port === link.dataset.port);
    }
  };
  const disconnect = () => {
    for (const portLink of portLinks) portLink.classList.remove('is-linked');
  };
  link.addEventListener('pointerenter', connect);
  link.addEventListener('pointerleave', disconnect);
  link.addEventListener('focus', connect);
  link.addEventListener('blur', disconnect);
}

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08 });
  for (const element of document.querySelectorAll('[data-reveal]')) {
    if (element.getBoundingClientRect().top > window.innerHeight) {
      element.classList.add('will-reveal');
      observer.observe(element);
    }
  }
}

document.querySelector('#copyright-year').textContent = new Date().getFullYear();
