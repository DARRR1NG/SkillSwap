import clsx from 'clsx';
import {
  forwardRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
  useState,
} from 'react';
import s from './input.module.css';

type InputVariant = 'default' | 'search';
type InputSize = 'md' | 'lg';

export type InputProps = {
  label?: string;
  error?: string;
  hint?: string;
  variant?: InputVariant;
  inputSize?: InputSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  onValueChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>;

const SearchIcon = () => (
  <svg
    className={s.iconSvg}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M11.5349 21.0698C6.27908 21.0698 2 16.7907 2 11.5349C2 6.27908 6.27908 2 11.5349 2C16.7907 2 21.0698 6.27908 21.0698 11.5349C21.0698 16.7907 16.7907 21.0698 11.5349 21.0698ZM11.5349 3.39535C7.04187 3.39535 3.39535 7.05118 3.39535 11.5349C3.39535 16.0186 7.04187 19.6745 11.5349 19.6745C16.0279 19.6745 19.6745 16.0186 19.6745 11.5349C19.6745 7.05118 16.0279 3.39535 11.5349 3.39535Z"
      fill="currentColor"
    />
    <path
      d="M21.3023 21.9996C21.1255 21.9996 20.9488 21.9345 20.8093 21.7949L18.9488 19.9345C18.679 19.6647 18.679 19.2182 18.9488 18.9484C19.2186 18.6787 19.6651 18.6787 19.9348 18.9484L21.7953 20.8089C22.0651 21.0787 22.0651 21.5252 21.7953 21.7949C21.6558 21.9345 21.479 21.9996 21.3023 21.9996Z"
      fill="currentColor"
    />
  </svg>
);

const EyeIcon = ({ crossed }: { crossed: boolean }) => (
  <svg className={s.iconSvg} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
    {crossed && (
      <path
        d="M4.5 4.5 19.5 19.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    )}
  </svg>
);

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      error,
      hint,
      variant = 'default',
      inputSize = variant === 'search' ? 'md' : 'lg',
      leftIcon,
      rightIcon,
      fullWidth = true,
      className,
      type = 'text',
      disabled,
      onChange,
      onValueChange,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = `${inputId}-description`;
    const isPassword = type === 'password';
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const displayedType = isPassword && isPasswordVisible ? 'text' : type;
    const message = error ?? hint;
    const hasLeftIcon = Boolean(leftIcon) || variant === 'search';
    const hasRightControl = Boolean(rightIcon) || isPassword;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      onValueChange?.(event.target.value, event);
    };

    return (
      <div className={clsx(s.root, fullWidth && s.fullWidth, className)}>
        {label && (
          <label className={s.label} htmlFor={inputId}>
            {label}
          </label>
        )}

        <div
          className={clsx(
            s.control,
            s[variant],
            s[inputSize],
            error && s.error,
            disabled && s.disabled,
            hasLeftIcon && s.withLeftIcon,
            hasRightControl && s.withRightIcon
          )}
        >
          {hasLeftIcon && (
            <span className={s.icon} aria-hidden="true">
              {leftIcon ?? <SearchIcon />}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={s.input}
            type={displayedType}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={message ? descriptionId : undefined}
            onChange={handleChange}
            {...rest}
          />

          {isPassword ? (
            <button
              className={s.iconButton}
              type="button"
              disabled={disabled}
              aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
              onClick={() => setIsPasswordVisible((value) => !value)}
            >
              <EyeIcon crossed={!isPasswordVisible} />
            </button>
          ) : (
            rightIcon && (
              <span className={s.icon} aria-hidden="true">
                {rightIcon}
              </span>
            )
          )}
        </div>

        {message && (
          <p className={clsx(s.message, error && s.messageError)} id={descriptionId}>
            {message}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
