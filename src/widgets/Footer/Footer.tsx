import { Logo } from '../../shared/ui/logo';

import s from './Footer.module.css';

export function Footer() {
  return (
    <footer>
      <Logo />
      <nav className={s.nav} aria-label="Навигация">
        <ul className={s.footer_links}>
          <li>О проекте</li>
          <li>Все навыки</li>
        </ul>
        <ul className={s.footer_links}>
          <li>Контакты</li>
          <li>Блог</li>
        </ul>
        <ul className={s.footer_links}>
          <li>Политика конфиденциальности</li>
          <li>Пользовательское соглашение</li>
        </ul>
      </nav>
      <div className={s.bottom}>SkillSwap — 2026</div>
    </footer>
  );
}
