import { Button } from '../../../shared/ui/button';
import { Footer } from '../../../widgets/Footer';
import { Header } from '../../../widgets/Header';
import s from '../error.module.css';

export const Error404 = () => {
  const handleLoginClick = () => {
    console.log('Login clicked');
  };

  const handleRegisterClick = () => {
    console.log('Register clicked');
  };
  return (
    <>
      <Header onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
      <div className={s.error}>
        <img src="images\decor\error-404.svg" alt="ошибка 404" className={s.img404} />
        <div className={s.errorInfoContiner}>
          <div className={s.errorText}>
            <span className={s.mainErrorText}>Страница не найдена</span>
            <p className={s.descErrorText}>
              К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте
              позже
            </p>
          </div>
          <div className={s.errorButtons}>
            <Button children={'Сообщить об ошибке'} color={'white'} />
            <Button children={'На главную'} color={'green'} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
