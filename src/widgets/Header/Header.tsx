import React from 'react';
import clsx from 'clsx';
import { Logo } from '../../shared/ui/logo';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/input';
import { MainDroplist } from '../MainDroplist/MainDroplist';
import { SearchIcon } from '../../shared/ui/input/input';
import { IconButton } from '../../shared/ui/IconButton';
import { useState } from 'react';
import styles from './Header.module.css';

export type HeaderProps = {
  onLoginClick: () => void;
  onRegisterClick: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onLoginClick, onRegisterClick }) => {
  const [isChevronActive, setChevronActive] = useState(false);
  const [isMoonActive, setMoonActive] = useState(false);

  const handleChevronClick = () => {
    setChevronActive(!isChevronActive);
  };

  const handleMoonClick = () => {
    setMoonActive(!isMoonActive);
  };

  return (
    <header className={clsx(styles.header)}>
      <div className={clsx(styles.container)}>
        {/* Левая часть- логотип и навигация */}
        <div className={clsx(styles.leftSection)}>
          <Logo className={clsx(styles.logo)} />
          <nav className={clsx(styles.nav)}>
            <a href="/about" className={clsx(styles.navLink)}>
              О проекте
            </a>
            <MainDroplist />
            <IconButton
              onClick={handleChevronClick}
              src="../public/icons/chevron-down.svg"
              className={isChevronActive ? styles.rotated : ''}
            />
          </nav>
        </div>

        {/* Центральная часть - поиск */}
        <div className={clsx(styles.centerSection)}>
          <Input leftIcon={<SearchIcon />} placeholder="Искать навык" />
        </div>

        {/* Правая часть - переключатель темы и кнопки авторизации */}
        <div className={clsx(styles.rightSection)}>
          {/* Иконка переключения темы (луна)*/}
          <div className={clsx(styles.iconMoon)}>
            <IconButton
              onClick={handleMoonClick}
              src="../public/icons/moon.svg"
              className={isMoonActive ? styles.active : ''}
            />
          </div>
          {/* Кнопки авторизации */}
          <Button color="white" className={clsx(styles.loginBtn)} onClick={onLoginClick}>
            Войти
          </Button>
          <Button color="green" className={clsx(styles.registerBtn)} onClick={onRegisterClick}>
            Зарегистрироваться
          </Button>
        </div>
      </div>
    </header>
  );
};
