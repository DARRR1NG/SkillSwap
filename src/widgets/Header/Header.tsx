import React, { useState } from 'react';
import clsx from 'clsx';
import { Logo } from '../../shared/ui/logo';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/input';
import { MainDroplist } from '../MainDroplist/MainDroplist';
import { SearchIcon } from '../../shared/ui/input/input';
import { IconButton } from '../../shared/ui/IconButton';
import styles from './Header.module.css';

export type HeaderProps = {
  variant?: 'default' | 'auth';
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onCloseClick?: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  variant = 'default',
  onLoginClick,
  onRegisterClick,
  onCloseClick,
}) => {
  const [isChevronActive, setChevronActive] = useState(false);
  const [isMoonActive, setMoonActive] = useState(false);

  const isAuthVariant = variant === 'auth';

  const handleChevronClick = () => {
    setChevronActive(!isChevronActive);
  };

  const handleMoonClick = () => {
    setMoonActive(!isMoonActive);
  };

  return (
    <header className={clsx(styles.header, isAuthVariant && styles.authHeader)}>
      <div className={clsx(styles.container, isAuthVariant && styles.authContainer)}>
        <div className={styles.leftSection}>
          <Logo className={styles.logo} />

          {!isAuthVariant && (
            <nav className={styles.nav}>
              <a href="/about" className={styles.navLink}>
                О проекте
              </a>

              <MainDroplist />

              <IconButton
                onClick={handleChevronClick}
                src="../public/icons/chevron-down.svg"
                className={isChevronActive ? styles.rotated : ''}
              />
            </nav>
          )}
        </div>

        {!isAuthVariant && (
          <div className={styles.centerSection}>
            <Input variant="search" leftIcon={<SearchIcon />} placeholder="Искать навык" />
          </div>
        )}

        {!isAuthVariant && (
          <div className={styles.rightSection}>
            <div className={styles.iconMoon}>
              <IconButton
                onClick={handleMoonClick}
                src="../public/icons/moon.svg"
                className={isMoonActive ? styles.active : ''}
              />
            </div>

            <Button color="white" className={styles.loginBtn} onClick={onLoginClick}>
              Войти
            </Button>

            <Button color="green" className={styles.registerBtn} onClick={onRegisterClick}>
              Зарегистрироваться
            </Button>
          </div>
        )}

        {isAuthVariant && (
          <button className={styles.closeButton} type="button" onClick={onCloseClick}>
            <span>Закрыть</span>
            <span className={styles.closeIcon} aria-hidden="true">
              ×
            </span>
          </button>
        )}
      </div>
    </header>
  );
};
