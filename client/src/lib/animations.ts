import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    // Observe all elements with scroll-reveal class
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}

export const animations = {
  fadeInUp: 'opacity-0 translate-y-8 transition-all duration-700 ease-out',
  fadeInUpActive: 'opacity-100 translate-y-0',
  scaleIn: 'opacity-0 scale-95 transition-all duration-500 ease-out',
  scaleInActive: 'opacity-100 scale-100',
  slideInLeft: 'opacity-0 -translate-x-8 transition-all duration-600 ease-out',
  slideInLeftActive: 'opacity-100 translate-x-0',
};

export function triggerScrollAnimation() {
  const elements = document.querySelectorAll('.scroll-reveal:not(.revealed)');
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('revealed');
    }, index * 100);
  });
}
