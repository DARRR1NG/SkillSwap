import type { FC, ReactNode, ButtonHTMLAttributes } from 'react';
import s from './button.module.css';
import clsx from 'clsx';

type ButtonProps = {
  children: ReactNode;
  color: 'green' | 'white';
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = ({ children, color, disabled, className, ...rest }) => {
  return (
    <button
      className={clsx(
        s.button_base,
        color === 'green' ? s.button_green : s.button_white,
        className
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
