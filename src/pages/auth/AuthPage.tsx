import { useNavigate } from 'react-router-dom';
import { Header } from '../../widgets/Header';
import { AuthForm } from '../../widgets/AuthForm';
import { InfoAuth } from '../../widgets/InfoAuth/InfoAuth';
import styles from './AuthPage.module.css';

const STEPS = [1, 2, 3];

export function AuthPage() {
  const navigate = useNavigate();

  const handleCloseClick = () => {
    navigate('/');
  };

  return (
    <main className={styles.page}>
      <Header variant="auth" onCloseClick={handleCloseClick} />

      <section className={styles.content} aria-labelledby="auth-page-title">
        <div className={styles.steps} aria-label="Шаг 1 из 3">
          <h1 id="auth-page-title" className={styles.stepTitle}>
            Шаг 1 из 3
          </h1>

          <div className={styles.stepLines} aria-hidden="true">
            {STEPS.map((step) => (
              <span key={step} className={step === 1 ? styles.stepLineActive : styles.stepLine} />
            ))}
          </div>
        </div>

        <div className={styles.cards}>
          <div className={styles.formCard}>
            <AuthForm />
          </div>

          <InfoAuth
            img="/images/decor/light-bulb.svg"
            alt="Лампочка"
            title="Добро пожаловать в SkillSwap!"
            text="Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми"
          />
        </div>
      </section>
    </main>
  );
}
