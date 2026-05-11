import s from './userCard.module.css';
import { useState, type FC } from 'react';
import { Button } from '../../shared/ui/button';
import type { TUser, City, TSkillCanTeach, TSkillWant } from '../../utils/types';
import citiesData from '../../../public/db/cities.json';
import skillsData from '../../../public/db/skills.json';
import clsx from 'clsx';
import { IconButton } from '../../shared/ui/IconButton';

const getAgeFromBirthday = (date: string): number => {
  const birthDate = new Date(date);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;

  return age;
};

const categoryBgMap: Record<number, string> = {
  1: s.violet,
  2: s.yellow,
  3: s.orange,
  4: s.pink,
  5: s.blue,
  6: s.green,
};

const getCityNameById = (id: number): string | undefined => {
  const data = citiesData as { cities: City[] };
  return data.cities.find((city) => city.id === id)?.name;
};

const getSkillById = (id: number): TSkillWant | undefined => {
  return skillsData.find((e) => e.id === id);
};

const Skills: FC<{ skills: Array<TSkillWant | TSkillCanTeach>; title: string }> = ({
  skills,
  title,
}) => {
  const max = 2;
  const skillsToShow = skills.slice(0, max);
  const skillsToHide = skills.length - max;

  const getSkillTitle = (skill: TSkillWant | TSkillCanTeach) => {
    return 'title' in skill ? skill.title : skill.customTitle;
  };

  return (
    <div>
      <p className={s.skills_title}>{title}</p>
      <div className={s.skills_container}>
        {skillsToShow.map((e) => (
          <div className={clsx(s.skill, categoryBgMap[e.categoryId])}>{getSkillTitle(e)}</div>
        ))}
        {skillsToHide > 0 && <div className={s.skill}>{`+${skillsToHide}`}</div>}
      </div>
    </div>
  );
};

export const UserCard: FC<{ user: TUser }> = ({ user }) => {
  const skillsWant = user.skillsWantId.map((e) => getSkillById(+e)).filter((e) => e !== undefined);
  const [isActive, setActive] = useState(false);
  const handleLike = () => {
    setActive(!isActive);
    // to do: добавить dispatch для добавления в избранное
  };
  return (
    <div className={s.card_container}>
      <div className={s.person_info}>
        <div className={s.userInfo}>
          <img className={s.card_image} src={user.userAvatar} alt="avatar" />
          <div>
            <h2 className={s.person_name}>{user.name}</h2>
            <p className={s.person_city}>
              {getCityNameById(user.cityId)}, {getAgeFromBirthday(user.birthday)}
            </p>
          </div>
        </div>
        <IconButton
          onClick={handleLike}
          src={isActive ? '../public/icons/like-icon.svg' : '../public/icons/like-fill.svg'}
          className={s.iconLike}
        />
      </div>
      <Skills skills={user.skillsCanTeach} title={'Может научить'} />
      <Skills skills={skillsWant} title={'Хочет научиться'} />
      <Button className={s.button} color="green">
        Подробнее
      </Button>
    </div>
  );
};
