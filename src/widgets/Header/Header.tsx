import React from 'react';
import clsx from 'clsx';
import { Logo } from '../../shared/ui/logo';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/input';
import { MainDroplist } from '../MainDroplist/MainDroplist';
import styles from './Header.module.css';

interface HeaderProps {
    onSearchChange?: (value: string) => void;
    onLoginClick?: () => void;
    onRegisterClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    onSearchChange,
    onLoginClick,
    onRegisterClick,
}) => {
    return (
        <header className={clsx(styles.header)}>
            {/* Левая часть- логотип и навигация */}
            <div className={clsx(styles.leftSection)}>
                <Logo className={clsx(styles.logo)} />
                <nav className={clsx(styles.nav)}>
                    <a
                        href="/about"
                        className={clsx(styles.navLink)}
                    >
                        О проекте
                    </a>
                    <MainDroplist />
                </nav>
            </div>

            {/* Центральная часть - поиск */}
            <div className={clsx(styles.centerSection)}>
                <Input
                    variant="search"
                    inputSize="md"
                    leftIcon
                    placeholder="Искать навык"
                    className={clsx(styles.searchInput)}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                />
            </div>

            {/* Правая часть - переключатель темы и кнопки авторизации */}
            <div className={clsx(styles.rightSection)}>
                {/* Иконка переключения темы (луна)- пока не функциональна */}
                <div className={clsx(styles.themeToggle)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.773 15.93c-.27.137-.562.203-.85.203s-.58-.066-.85-.203l-3.218-3.218a6.96 6.96 0 0 0-1.316 2.52c0 4.419-3.582 8-8 8s-8-3.581-8-8c0-5.486 4.407-10 10-10s10 4.514 10 10v.026c-.552.026-1.087.165-1.58.377l3.218 3.218c.27.137.562.203.85.203s.58-.066.85-.203z" />
                    </svg>
                </div>

                {/* Кнопки авторизации */}
                <Button
                    color="white"
                    className={clsx(styles.loginBtn)}
                    onClick={onLoginClick}
                >
                    Войти
                </Button>
                <Button
                    color="green"
                    className={clsx(styles.registerBtn)}
                    onClick={onRegisterClick}
                >
                    Зарегистрироваться
                </Button>
            </div>
        </header>
    );
};