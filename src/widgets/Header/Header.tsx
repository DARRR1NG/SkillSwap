import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Logo } from '../../shared/ui/logo';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/input';
import { MainDroplist } from '../MainDroplist/MainDroplist';
import { SearchIcon } from '../../shared/ui/input/input';
import { IconButton } from '../../shared/ui/IconButton';
import { logout, selectIsAuthenticated, selectUser } from '../../store/slices/authSlice';
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
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
                src="/icons/chevron-down.svg"
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
            {!isAuthenticated ? (
              <>
                <div className={styles.iconMoon}>
                  <IconButton
                    onClick={handleMoonClick}
                    src="/icons/moon.svg"
                    className={isMoonActive ? styles.active : ''}
                  />
                </div>

                <Button color="white" className={styles.loginBtn} onClick={onLoginClick}>
                  Войти
                </Button>

                <Button color="green" className={styles.registerBtn} onClick={onRegisterClick}>
                  Зарегистрироваться
                </Button>
              </>
            ) : (
              <div className={styles.userMenu}>
                <IconButton
                  onClick={handleMoonClick}
                  src="/icons/moon.svg"
                  className={clsx(styles.authThemeIcon, isMoonActive && styles.active)}
                />

                <button className={styles.headerIconButton} type="button" aria-label="Уведомления">
                  <img src="/icons/notification.svg" alt="" />
                </button>

                <button
                  className={styles.headerIconButton}
                  type="button"
                  aria-label="Избранное"
                  onClick={handleFavoritesClick}
                >
                  <img src="/icons/like-icon.svg" alt="" />
                </button>

                <button
                  className={styles.profileButton}
                  type="button"
                  title="Выйти"
                  onClick={handleLogout}
                >
                  <span className={styles.userName}>{user?.name}</span>
                  <img
                    className={styles.userAvatar}
                    src={user?.avatar || '/icons/user-circle.svg'}
                    alt=""
                  />
                </button>
              </div>
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
