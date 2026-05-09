import React from 'react';
import clsx from 'clsx';
import { Logo } from '../../shared/ui/logo';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/input';
import { MainDroplist } from '../MainDroplist/MainDroplist';
import MoonIcon from '../../images/icon/moon.svg';
import ChevronDown from '../../images/icon/chevron-down.svg';
import { SearchIcon } from '../../shared/ui/input/input';
import styles from './Header.module.css';

interface HeaderProps {
    onSearchChange?: (value: string) => void;
    onLoginClick?: () => void;
    onRegisterClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick, onRegisterClick }) => {
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
                        <img src={ChevronDown} alt="" className={clsx(styles.chevron)} />
                    </nav>
                </div>

                {/* Центральная часть - поиск */}
                <div className={clsx(styles.centerSection)}>
                    <Input leftIcon={<SearchIcon />} placeholder="Искать навык" />
                </div>

                {/* Правая часть - переключатель темы и кнопки авторизации */}
                <div className={clsx(styles.rightSection)}>
                    {/* Иконка переключения темы (луна)- пока не функциональна */}
                    <button className={styles.iconButton} type="button" aria-label="Переключить тему">
                        <img src={MoonIcon} alt="" className={clsx(styles.icon)} />
                    </button>

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
