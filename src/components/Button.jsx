import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Vintage Editorial Button Component
 * Supports multiple philatelic themes: primary (burgundy), secondary (navy), gold, outline, and ghost.
 */
export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'right',
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 tracking-wide select-none disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 focus:ring-offset-ivory";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5 rounded-sm",
    md: "text-sm px-5 py-2.5 gap-2 rounded-sm",
    lg: "text-base px-6 py-3.5 gap-2.5 rounded-sm",
  };

  const variantStyles = {
    primary: "bg-burgundy text-ivory hover:bg-burgundy-800 active:bg-burgundy-900 shadow-sm hover:shadow",
    secondary: "bg-navy text-ivory hover:bg-navy-800 active:bg-navy-950 shadow-sm hover:shadow",
    gold: "bg-gold text-navy-950 hover:bg-gold-500 font-semibold shadow-sm hover:shadow",
    outline: "border border-navy/30 text-navy hover:bg-navy hover:text-ivory bg-transparent",
    outlineGold: "border border-gold text-gold-900 hover:bg-gold hover:text-navy-950 bg-transparent",
    ghost: "text-navy hover:text-burgundy hover:bg-navy/5 bg-transparent",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`group ${combinedClasses}`} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={`group ${combinedClasses}`} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group ${combinedClasses}`}
      {...props}
    >
      {content}
    </button>
  );
}
