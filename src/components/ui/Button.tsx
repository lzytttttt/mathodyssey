import { clsx } from 'clsx';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
          {
            'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm': variant === 'primary',
            'bg-stone-100 dark:bg-white/10 text-stone-900 dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-white/15':
              variant === 'secondary',
            'border border-stone-300 dark:border-white/15 bg-white dark:bg-transparent text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5':
              variant === 'outline',
            'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10':
              variant === 'ghost',
            'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40':
              variant === 'gradient',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;
