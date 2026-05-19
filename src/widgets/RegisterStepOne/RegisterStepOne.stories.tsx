import clsx from 'clsx';
import { type FormEvent, useState } from 'react';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/input';
import s from './AuthForm.module.css';

export default {};
export type AuthFormValues = {
  email: string;
  password: string;
};

export type AuthFormProps = {
  className?: string;
  defaultEmail?: string;
  defaultPassword?: string;
  emailError?: string;
  passwordHint?: string;
  passwordPlaceholder?: string;
  submitText?: string;
  isSubmitDisabled?: boolean;
  onSubmit?: (values: AuthFormValues) => void;
  onGoogleClick?: () => void;
  onAppleClick?: () => void;
};

const MIN_PASSWORD_LENGTH = 8;

const validateEmail = (email: string) => {
  if (!email.trim()) {
    return 'Введите email';
  }

  if (!email.includes('@')) {
    return 'Введите корректный email';
  }

  return '';
};

const validatePassword = (password: string) => {
  if (!password) {
    return 'Введите пароль';
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return 'Пароль должен содержать не менее 8 знаков';
  }

  return '';
};

const GoogleIcon = () => (
  <svg
    className={s.socialIcon}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.06H2.18A10.96 10.96 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84Z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg
    className={clsx(s.socialIcon, s.appleIcon)}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M18.28 12.86c-.03-2.48 2.03-3.67 2.12-3.73-1.16-1.69-2.95-1.92-3.58-1.95-1.52-.16-2.97.9-3.75.9-.78 0-1.97-.88-3.24-.86-1.67.02-3.21.97-4.07 2.45-1.73 3-.45 7.45 1.25 9.89.82 1.19 1.81 2.53 3.1 2.47 1.24-.04 1.71-.8 3.22-.8 1.5 0 1.92.8 3.24.78 1.34-.02 2.18-1.22 3-2.42.95-1.38 1.34-2.73 1.36-2.8-.03-.01-2.63-1.01-2.65-3.93ZM15.83 5.59c.69-.83 1.15-1.98 1.02-3.13-.99.04-2.18.65-2.89 1.49-.63.73-1.19 1.9-1.04 3.01 1.09.09 2.22-.56 2.91-1.37Z"
      fill="currentColor"
    />
  </svg>
);

export const AuthForm = ({
  className,
  defaultEmail = '',
  defaultPassword = '',
  emailError,
  passwordHint = 'Пароль должен содержать не менее 8 знаков',
  passwordPlaceholder = 'Придумайте надёжный пароль',
  submitText = 'Далее',
  isSubmitDisabled = false,
  onSubmit,
  onGoogleClick,
  onAppleClick,
}: AuthFormProps) => {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [emailValidationError, setEmailValidationError] = useState(emailError ?? '');
  const [passwordValidationError, setPasswordValidationError] = useState('');

  const resolvedEmailError = emailError ?? emailValidationError;

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (emailValidationError) {
      setEmailValidationError(validateEmail(value));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (passwordValidationError) {
      setPasswordValidationError(validatePassword(value));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password);

    setEmailValidationError(nextEmailError);
    setPasswordValidationError(nextPasswordError);

    if (nextEmailError || nextPasswordError) {
      return;
    }

    onSubmit?.({ email, password });
  };

  return (
    <form className={clsx(s.form, className)} noValidate onSubmit={handleSubmit}>
      <div className={s.socialButtons}>
        <button className={s.socialButton} type="button" onClick={onGoogleClick}>
          <GoogleIcon />
          <span>Продолжить с Google</span>
        </button>

        <button className={s.socialButton} type="button" onClick={onAppleClick}>
          <AppleIcon />
          <span>Продолжить с Apple</span>
        </button>
      </div>

      <div className={s.divider} aria-hidden="true">
        <span>или</span>
      </div>

      <div className={s.fields}>
        <Input
          className={s.authInput}
          label="Email"
          type="email"
          placeholder="Введите email"
          autoComplete="email"
          value={email}
          error={resolvedEmailError}
          onValueChange={handleEmailChange}
        />

        <Input
          className={s.authInput}
          label="Пароль"
          type="password"
          placeholder={passwordPlaceholder}
          autoComplete="new-password"
          value={password}
          error={passwordValidationError}
          hint={passwordValidationError ? undefined : passwordHint}
          onValueChange={handlePasswordChange}
        />
      </div>

      <Button className={s.submitButton} color="green" type="submit" disabled={isSubmitDisabled}>
        {submitText}
      </Button>
    </form>
  );
};
