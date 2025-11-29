import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ScrollAnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollAnimatedSection({ 
  children, 
  className = '', 
  delay = 0 
}: ScrollAnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children} 
    </section>
  );
}