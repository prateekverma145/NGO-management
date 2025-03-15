import React, { ButtonHTMLAttributes, useState } from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  icon,
  iconPosition = 'left',
  onClick,
  ...props
}) => {
  const [rippleStyle, setRippleStyle] = useState<React.CSSProperties>({});
  const [showRipple, setShowRipple] = useState(false);

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    setRippleStyle({
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}px`,
      top: `${y}px`,
    });

    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 600);

    if (onClick) {
      onClick(e);
    }
  };

  const baseClasses = 'relative overflow-hidden font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white rounded-lg focus:ring-blue-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500 dark:text-gray-100 rounded-lg focus:ring-gray-400 dark:focus:ring-gray-500',
    outlined: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:active:bg-blue-900/50 rounded-lg focus:ring-blue-500',
    text: 'bg-transparent text-blue-600 hover:bg-blue-50 active:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:active:bg-blue-900/50 focus:ring-blue-500',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 active:bg-white/30 dark:bg-black/10 dark:border-white/10 dark:hover:bg-white/10 dark:active:bg-white/20 rounded-lg focus:ring-white/50',
  };
  
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : 'transform active:scale-[0.98] shadow-sm hover:shadow dark:shadow-gray-900/30';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        disabledClasses,
        widthClass,
        className
      )}
      disabled={disabled}
      onClick={handleRipple}
      {...props}
    >
      <span className="flex items-center justify-center">
        {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </span>
      {showRipple && (
        <span
          className="absolute rounded-full bg-white/30 dark:bg-white/20 animate-ripple"
          style={rippleStyle}
        />
      )}
    </button>
  );
};

export default Button;