import { clsx } from 'clsx';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-xl bg-white',
          {
            'border border-stone-200': variant === 'bordered',
            'shadow-md': variant === 'elevated',
            'border border-stone-200 shadow-sm': variant === 'default',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export default Card;
