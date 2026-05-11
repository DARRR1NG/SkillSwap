import { Button } from '../../../shared/ui/button';
import { Footer } from '../../../widgets/Footer';
import s from '../error.module.css';

export function Error404() {
  return (
    <>
      <div className={s.error}>
        <img src="public\images\decor\error-404.svg" alt="ошибка 404" className={s.img404} />
        <div className={s.errorInfoContiner}>
          <div className={s.errorText}>
            <span className={s.mainErrorText}>Страница не найдена</span>
            <p className={s.descErrorText}>
              К сожалению, эт страница недоступна. Вернитесь на главную страницу или попробуйте
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
}
