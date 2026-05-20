import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../widgets/Header';
import { InfoAuth } from '../../widgets/InfoAuth/InfoAuth';
import { RegisterStepOne } from '../../widgets/RegisterStepOne';
import { RegisterStepTwo } from '../../widgets/RegisterStepTwo';
import { RegisterStepThree } from '../../widgets/RegisterStepThree';
import {
  selectAuthError,
  selectIsAuthenticated,
  selectRegistrationStep,
  setRegistrationStep,
} from '../../store/slices/authSlice';
import styles from './RegisterPage.module.css';

const STEPS = [1, 2, 3] as const;

const STEP_INFO = {
  1: {
    img: '/images/decor/light-bulb.svg',
    alt: 'Лампочка',
    title: 'Добро пожаловать в SkillSwap!',
    text: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
  },
  2: {
    img: '/images/decor/user info.svg',
    alt: 'Пользователь с сообщением',
    title: 'Расскажите немного о себе',
    text: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
  },
  3: {
    img: '/images/decor/school-board.svg',
    alt: 'Доска с презентацией',
    title: 'Укажите, чем вы готовы поделиться',
    text: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
  },
};

export function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentStep = useSelector(selectRegistrationStep);
  const authError = useSelector(selectAuthError);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleCloseClick = () => {
    navigate('/');
  };

  const handleStepBack = () => {
    dispatch(
      setRegistrationStep(currentStep === 1 ? 1 : ((currentStep - 1) as typeof currentStep))
    );
  };

  const stepInfo = STEP_INFO[currentStep];

  return (
    <main className={styles.page}>
      <Header variant="auth" onCloseClick={handleCloseClick} />

      <section className={styles.content} aria-labelledby="register-page-title">
        <div className={styles.steps} aria-label={`Шаг ${currentStep} из 3`}>
          <h1 id="register-page-title" className={styles.stepTitle}>
            Шаг {currentStep} из 3
          </h1>

          <div className={styles.stepLines} aria-hidden="true">
            {STEPS.map((step) => (
              <span
                key={step}
                className={step <= currentStep ? styles.stepLineActive : styles.stepLine}
              />
            ))}
          </div>
        </div>

        <div className={styles.cards}>
          <div className={styles.formCard}>
            {currentStep === 1 && <RegisterStepOne emailError={authError || undefined} />}

            {currentStep === 2 && <RegisterStepTwo onBack={handleStepBack} />}

            {currentStep === 3 && <RegisterStepThree onBack={handleStepBack} />}
          </div>

          <InfoAuth
            img={stepInfo.img}
            alt={stepInfo.alt}
            title={stepInfo.title}
            text={stepInfo.text}
          />
        </div>
      </section>
    </main>
  );
}
