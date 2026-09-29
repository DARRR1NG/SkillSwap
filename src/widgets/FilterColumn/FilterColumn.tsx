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

interface FilterColumnProps {
  wantCanValue: 'all' | 'want' | 'can';
  setWantCanValue: (value: 'all' | 'want' | 'can') => void;
  genderValue: 'all' | 'male' | 'female';
  setGenderValue: (value: 'all' | 'male' | 'female') => void;
  selectedCities: number[];
  setSelectedCities: (cities: number[]) => void;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
}

export const FilterColumn = ({
  wantCanValue,
  setWantCanValue,
  genderValue,
  setGenderValue,
  selectedCities,
  setSelectedCities,
  selectedSkills,
  setSelectedSkills,
}: FilterColumnProps) => {
  const optionsWantCan = [
    { text: 'Все', selected: wantCanValue === 'all', onClick: () => setWantCanValue('all') },
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

  const optionsGenders = [
    {
      text: 'Не имеет значения',
      selected: genderValue === 'all',
      onClick: () => setGenderValue('all'),
    },
    { text: 'Мужской', selected: genderValue === 'male', onClick: () => setGenderValue('male') },
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
        fetch('../public/db/skills.json').then(
          (response) => response.json() as Promise<SkillsJson>
        ),
        fetch('../public/db/skillsCategories.json').then(
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
    <div className={s.filterColumnContainer}>
      <h2>Фильтры</h2>
      <div className={s.categoriesContainer}>
        <div className={s.wantCanTeachRadioButtons}>
          <RadioSelector options={optionsWantCan} />
        </div>
        <div className={s.skills}>
          <h3>Навыки</h3>
          <SkillCheckboxes
            categories={categories}
            selectedIds={selectedSkills}
            onSelectedChange={setSelectedSkills}
          />
        </div>
        <div className={s.genders}>
          <h3>Пол автора</h3>
          <RadioSelector options={optionsGenders} />
        </div>
        <div className={s.cities}>
          <h3>Город</h3>
          <CitiesCheckboxes selectedIds={selectedCities} onSelectedChange={setSelectedCities} />
        </div>
      </div>
    </div>
  );
};
