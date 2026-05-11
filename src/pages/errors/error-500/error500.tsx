import { Button } from '../../../shared/ui/button';
import { Footer } from '../../../widgets/Footer';
import s from '../error.module.css';

export function Error500() {
  return (
    <>
      <div className={s.error}>
        <img src="public\images\decor\error-500.svg" alt="ошибка 500" className={s.img} />
        <div className={s.errorInfoContiner}>
          <div className={s.errorText}>
            <span className={s.mainErrorText}>На сервере произошла ошибка</span>
            <p className={s.descErrorText}>Попробуйте позже или вернитесь на главную страницу</p>
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
