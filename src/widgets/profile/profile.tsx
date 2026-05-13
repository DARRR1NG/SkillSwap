import { Autocomplete } from '../../shared/ui/autocomplete/Autocomplete';
import { Input } from '../../shared/ui/input';
import s from './profile.module.css';
import citiesData from '../../../public/db/cities.json';
import type { TUser } from '../../utils/types';
import { useState, type FC } from 'react';
import { Button } from '../../shared/ui/button';

export const Profile: FC<{ user: TUser }> = ({ user }) => {
  const citiesOptions = citiesData.cities.map((e) => e.name);
  const [emailInput, setEmailInput] = useState<string>(user.email);
  const [nameInput, setNameInput] = useState<string>(user.name);
  const [aboutInput, setAboutInput] = useState<string>(user.about);
  return (
    <div className={s.profile}>
      <div className={s.ladels_container}>
        <Input
          label="Почта"
          variant="default"
          fullWidth={true}
          rightIcon={<img src="../../../public/icons/edit.svg" />}
          value={emailInput}
          onValueChange={setEmailInput}
        />
        <button className={s.button}>Изменить пароль</button>
        <Input
          label="Имя"
          variant="default"
          fullWidth={true}
          rightIcon={<img src="../../../public/icons/edit.svg" />}
          value={nameInput}
          onValueChange={setNameInput}
        />
        <div className={s.inputs}>
          <div>
            <p className={s.label_name}>Дата рождения</p> {/* вставить компонент даты */}
            <Autocomplete options={[]} />
          </div>
          <div>
            <p className={s.label_name}>Пол</p>
            <Autocomplete options={['Женский', 'Мужской']} />
          </div>
        </div>
        <div>
          <p className={s.label_name}>Город</p>
          <Autocomplete options={citiesOptions} />
        </div>
        <Input
          label="О себе"
          rightIcon={<img src="../../../public/icons/edit.svg" />}
          value={aboutInput}
          onValueChange={setAboutInput}
        />
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
