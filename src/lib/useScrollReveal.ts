import { useEffect } from 'react';

// Blocos que aparecem com a rolagem
const SELECTOR = [
  '.split > *',
  '.solutions__header > *',
  '.service',
  '.founder__photo',
  '.founder__text > *',
  '.connected__statements > li',
  '.connected__note',
  '.connected__equation',
  '.portfolio__header > *',
  '.project',
  '.portfolio__more',
  '.reasons__item',
  '.process__step',
  '.closing__action',
  '.contact__copy > *',
  '.contact__form',
  '.footer__grid > *',
  '.svc-list__item',
  '.svc-steps__item',
  '.svc-faq__item',
  '.svc-others__card',
  '.svc-band__text',
  '.svc-closing__text',
  '.privacy__body > section',
].join(', ');

const SKIP = '.hero, .svc-hero, .admin';
const STAGGER_MS = 90;
const MAX_STEPS = 5;

export function useScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

    const finish = (event: TransitionEvent) => {
      if (event.propertyName !== 'opacity' || event.target !== event.currentTarget) return;
      const el = event.currentTarget as HTMLElement;
      el.classList.remove('reveal', 'is-visible');
      el.style.removeProperty('--reveal-delay');
      el.removeEventListener('transitionend', finish);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.addEventListener('transitionend', finish as EventListener);
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    );

    const seen = new WeakSet<Element>();
    const scan = () => {
      const added: HTMLElement[] = [];
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (seen.has(el) || el.closest(SKIP)) return;
        seen.add(el);
        if (el.parentElement?.closest('.reveal')) return;
        const step = [...el.parentElement!.children].filter((c) => c.classList.contains('reveal')).length;
        el.style.setProperty('--reveal-delay', `${Math.min(step, MAX_STEPS) * STAGGER_MS}ms`);
        el.classList.add('reveal', 'reveal--start');
        added.push(el);
      });
      if (!added.length) return;
      void document.body.offsetHeight;
      for (const el of added) {
        el.classList.remove('reveal--start');
        io.observe(el);
      }
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);
}
