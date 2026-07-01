export function Button({
  children,
  className = '',
  variant = 'primary',
  isLoading = false,
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      className={`button button-${variant} ${className}`.trim()}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

