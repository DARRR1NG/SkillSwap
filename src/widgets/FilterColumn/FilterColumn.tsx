import s from './FilterColumn.module.css';
import { RadioSelector } from '../../shared/ui/radioSelector';
import { SkillCheckboxes, type SkillCheckboxesProps } from '../../shared/ui/skill-checkboxes';
import { useEffect, useState } from 'react';
import {
  mapSkillsJsonToCategories,
  type SkillCategoriesJson,
  type SkillsJson,
} from '../../shared/lib/skills';
import { CitiesCheckboxes } from '../../shared/ui/cities-checkboxes/cities-checkboxes';

export const FilterColumn = () => {
  // Состояние для "Хочу/Могу"
  const [wantCanValue, setWantCanValue] = useState<'all' | 'want' | 'can'>('all');

  // Состояние для пола
  const [genderValue, setGenderValue] = useState<'all' | 'male' | 'female'>('all');

  // Опции для "Хочу/Могу"
  const optionsWantCan = [
    {
      text: 'Все',
      selected: wantCanValue === 'all',
      onClick: () => setWantCanValue('all'),
    },
    {
      text: 'Хочу научиться',
      selected: wantCanValue === 'want',
      onClick: () => setWantCanValue('want'),
    },
    {
      text: 'Могу научить',
      selected: wantCanValue === 'can',
      onClick: () => setWantCanValue('can'),
    },
  ];

  // Опции для пола
  const optionsGenders = [
    {
      text: 'Не имеет значения',
      selected: genderValue === 'all',
      onClick: () => setGenderValue('all'),
    },
    {
      text: 'Мужской',
      selected: genderValue === 'male',
      onClick: () => setGenderValue('male'),
    },
    {
      text: 'Женский',
      selected: genderValue === 'female',
      onClick: () => setGenderValue('female'),
    },
  ];

  const useSkillCategories = () => {
    const [categories, setCategories] = useState<SkillCheckboxesProps['categories']>([]);

    useEffect(() => {
      Promise.all([
        fetch('/db/skills.json').then((response) => response.json() as Promise<SkillsJson>),
        fetch('/db/skillsCategories.json').then(
          (response) => response.json() as Promise<SkillCategoriesJson>
        ),
      ]).then(([skills, skillCategories]) =>
        setCategories(mapSkillsJsonToCategories(skills, skillCategories))
      );
    }, []);

    return categories;
  };

  const categories = useSkillCategories();

  return (
    <>
      <div className={s.filterColumnContainer}>
        <h2>Фильтры</h2>
        <div className={s.categoriesContainer}>
          <div className={s.wantCanTeachRadioButtons}>
            <RadioSelector options={optionsWantCan} />
          </div>
          <div className={s.skills}>
            <h3>Навыки</h3>
            <SkillCheckboxes categories={categories} />
          </div>
          <div className={s.genders}>
            <h3>Пол автора</h3>
            <RadioSelector options={optionsGenders} />
          </div>
          <div className={s.cities}>
            <h3>Город</h3>
            <CitiesCheckboxes />
          </div>
        </div>
      </div>
    </>
  );
};
