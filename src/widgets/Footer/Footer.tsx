import { Logo } from '../../shared/ui/logo';
import { MainDroplist } from '../MainDroplist/MainDroplist';

import s from './Footer.module.css';

type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stub = (text: string) => (
    <a className={`${s.link} ${s.linkStub}`.trim()} href="#" onClick={(e) => e.preventDefault()}>
      {text}
    </a>
  );

  return (
    <footer className={`${s.root} ${className ?? ''}`.trim()}>
      <div className={s.container}>
        <button
          type="button"
          className={s.logoButton}
          onClick={handleLogoClick}
          aria-label="SkillSwap"
        >
          <Logo />
        </button>

        <nav className={s.col} aria-label="Навигация">
          {stub('О проекте')}
          <MainDroplist />
        </nav>

        <div className={s.col}>
          {stub('Контакты')}
          {stub('Блог')}
          {stub('Политика конфиденциальности')}
          {stub('Пользовательское соглашение')}
        </div>
      </div>

      <div className={s.bottom}>SkillSwap — 2025</div>
    </footer>
  );
}
