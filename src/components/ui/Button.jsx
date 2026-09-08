import { forwardRef } from 'react';

const variants = {
  primary: 'btn-primary',
  primaryLg: 'btn-primary-lg',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  link: 'btn-link',
};

const Button = forwardRef(function Button(
  { as: Tag = 'button', variant = 'primary', className = '', children, ...rest },
  ref
) {
  const cls = `${variants[variant] || variants.primary} ${className}`;
  return (
    <Tag ref={ref} className={cls} {...rest}>
      {children}
    </Tag>
  );
});

export default Button;
