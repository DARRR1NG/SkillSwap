import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../widgets/Header';
import { InfoAuth } from '../../widgets/InfoAuth/InfoAuth';
import { RegisterStepOne } from '../../widgets/RegisterStepOne';
import { RegisterStepTwo } from '../../widgets/RegisterStepTwo';
import { RegisterStepThree } from '../../widgets/RegisterStepThree';
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
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<(typeof STEPS)[number]>(1);

  const handleCloseClick = () => {
    navigate('/');
  };

  const handleStepBack = () => {
    setCurrentStep((step) => (step === 1 ? step : ((step - 1) as typeof step)));
  };

  const handleStepForward = () => {
    setCurrentStep((step) => (step === 3 ? step : ((step + 1) as typeof step)));
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
            {currentStep === 1 && (
              <RegisterStepOne
                onSubmit={handleStepForward}
                onGoogleClick={handleStepForward}
                onAppleClick={handleStepForward}
              />
            )}

            {currentStep === 2 && (
              <RegisterStepTwo onBack={handleStepBack} onContinue={handleStepForward} />
            )}

            {currentStep === 3 && (
              <RegisterStepThree onBack={handleStepBack} onContinue={handleCloseClick} />
            )}
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
