import { Autocomplete } from '../../shared/ui/autocomplete/Autocomplete';
import { Input } from '../../shared/ui/input';
import s from './profile.module.css';
import citiesData from '../../../public/db/cities.json';
import type { TUser } from '../../utils/types';
import type { FC } from 'react';
import { Button } from '../../shared/ui/button';

export const Profile: FC<{ user: TUser }> = ({ user }) => {
  const citiesOptions = citiesData.cities.map((e) => e.name);
  return (
    <div className={s.profile}>
      <div className={s.ladels_container}>
        <Input label="Почта" variant="default" fullWidth={true} />
        <button className={s.button}>Изменить пароль</button>
        <Input label="Имя" variant="default" fullWidth={true} />
        <div className={s.inputs}>
          <div>
            <p className={s.label_name}>Дата рождения</p>
            <Autocomplete options={[]} />
          </div>
          <div>
            <p className={s.label_name}>Пол</p>
            <Autocomplete options={['Женский', 'Мужской']} />
          </div>
        </div>
        <Autocomplete options={citiesOptions} />
        <Input label="О себе" />
        <Button color="white" disabled>
          Сохранить
        </Button>
      </div>
      <div className={s.image_container}>
        <img className={s.image} src={user.userAvatar} alt="фото профиля" />
        <button className={s.edit_photo}>
          <img src="../../../public/icons/gallery-edit.svg" />
        </button>
      </div>
    </div>
  );
};
