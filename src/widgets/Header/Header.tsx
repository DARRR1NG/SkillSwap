import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { Logo } from '../../shared/ui/logo';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/input';
import { MainDroplist } from '../MainDroplist/MainDroplist';
import { SearchIcon } from '../../shared/ui/input/input';
import { IconButton } from '../../shared/ui/IconButton';
import { selectIsAuthenticated, selectUser } from '../../store/slices/authSlice';
import styles from './Header.module.css';

export type HeaderProps = {
  variant?: 'default' | 'auth';
  onCloseClick?: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  variant = 'default',
  onCloseClick,
}) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const [isChevronActive, setChevronActive] = useState(false);
  const [isMoonActive, setMoonActive] = useState(false);

  const isAuthVariant = variant === 'auth';

  const handleChevronClick = () => {
    setChevronActive(!isChevronActive);
  };

  const handleMoonClick = () => {
    setMoonActive(!isMoonActive);
  };

  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/reg');
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

              {isAuthenticated && (
                <button
                  type="button"
                  className="dropdown-trigger"
                  onClick={handleFavoritesClick}
                >
                  Избранное
                </button>
              )}
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

            {!isAuthenticated ? (
              <>
                <Button color="white" className={styles.loginBtn} onClick={handleLoginClick}>
                  Войти
                </Button>
                <Button color="green" className={styles.registerBtn} onClick={handleRegisterClick}>
                  Зарегистрироваться
                </Button>
              </>
            ) : (
              <button
                type="button"
                className={styles.profileButton}
                onClick={handleProfileClick}
              >
                <img 
                  src={user?.avatar || '/icons/profile-icon.svg'} 
                  alt="avatar" 
                  className={styles.profileAvatar}
                />
                <span>{user?.name || 'Профиль'}</span>
              </button>
            )}
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