import s from './ProfileNavigate.module.css';
import { Button } from '../../shared/ui/button';

export const ProfileNavigate = () => {
  return (
    <>
      <div className={s.profile_navigate_container}>
        <Button className={s.button_profile} children={'Заявки'} color={'green'} />
        <Button className={s.button_profile} children={'Мои обмены'} color={'green'} />
        <Button className={s.button_profile} children={'Избранное'} color={'green'} />
        <Button className={s.button_profile} children={'Мои навыки'} color={'green'} />
        <Button className={s.button_profile} children={'Личные данные'} color={'green'} />
      </div>
    </>
  );
};
