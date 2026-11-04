import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * Initializes scroll-triggered editorial entry reveals for sections
 * Ensures all elements remain visible by default even if GSAP encounters an issue
 */
export function initEditorialScrollMotion(containerRef: HTMLElement | null, reducedMotion: boolean) {
  if (!containerRef || reducedMotion || typeof window === 'undefined') return () => {};

  const ctx = gsap.context(() => {
    // Subtle stagger on section headers
    const headers = containerRef.querySelectorAll('section [class*="sectionHeader"], section [class*="header"]');
    headers.forEach((header) => {
      gsap.fromTo(
        header,
        { opacity: 0.2, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Staggered reveal for competition and domain cards
    const cardContainers = containerRef.querySelectorAll('[class*="cardsGrid"], [class*="quadrantGrid"], [class*="offeringsList"]');
    cardContainers.forEach((grid) => {
      const items = grid.children;
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0.3, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });
  }, containerRef);

  return () => {
    ctx.revert();
  };
}
