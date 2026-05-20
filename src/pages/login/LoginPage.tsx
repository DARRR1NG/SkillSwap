import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../widgets/Header';
import { InfoAuth } from '../../widgets/InfoAuth/InfoAuth';
import { LoginForm } from '../../widgets/LoginForm';
import { login, selectAuthError, selectIsAuthenticated } from '../../store/slices/authSlice';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authError = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleCloseClick = () => {
    navigate('/');
  };

  const handleRegisterClick = () => {
    navigate('/reg');
  };

  const handleSubmit = ({ email, password }: { email: string; password: string }) => {
    dispatch(login({ email, password }));
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
            <LoginForm
              onRegisterClick={handleRegisterClick}
              onSubmit={handleSubmit}
              authError={authError || undefined}
            />
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
