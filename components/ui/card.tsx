import type { ReactNode } from 'react';

interface CardProps {
  className?: string;
  children: ReactNode;
}

export default function Card({
  className = '',
  children,
}: CardProps) {
  const baseClasses = 'rounded-lg border bg-background text-foreground shadow-sm';

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
}