import { useNavigate } from 'react-router-dom';
import { Header } from '../../widgets/Header';
import { InfoAuth } from '../../widgets/InfoAuth/InfoAuth';
import { LoginForm } from '../../widgets/LoginForm';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();

  const handleCloseClick = () => {
    navigate('/');
  };

  const handleRegisterClick = () => {
    navigate('/reg');
  };

  return (
    <main className={styles.page}>
      <Header variant="auth" onCloseClick={handleCloseClick} />

      <section className={styles.content} aria-labelledby="login-page-title">
        <h1 id="login-page-title" className={styles.title}>
          Вход
        </h1>

        <div className={styles.cards}>
          <div className={styles.formCard}>
            <LoginForm onRegisterClick={handleRegisterClick} />
          </div>

          <InfoAuth
            img="/images/decor/light-bulb.svg"
            alt="Лампочка"
            title="С возвращением в SkillSwap!"
            text="Обменивайтесь знаниями и навыками с другими людьми"
          />
        </div>
      </section>
    </main>
  );
}
