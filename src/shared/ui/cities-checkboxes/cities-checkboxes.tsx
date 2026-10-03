import { useState, useEffect } from 'react';
import { CheckboxOption } from '../skill-checkboxes/skill-checkboxes';
import s from './cities-checkboxes.module.css';

interface CitiesCheckboxesProps {
  selectedIds?: number[];
  onSelectedChange?: (ids: number[]) => void;
}

const dt = await fetch(`${import.meta.env.BASE_URL}db/cities.json`);
const data = await dt.json();

export const CitiesCheckboxes = ({ selectedIds = [], onSelectedChange }: CitiesCheckboxesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [internalSelectedCities, setInternalSelectedCities] = useState<number[]>([]);

  // Синхронизация внешнего и внутреннего состояния
  useEffect(() => {
    setInternalSelectedCities(selectedIds);
  }, [selectedIds]);

  const handleCityChange = (cityId: number) => {
    const newSelected = internalSelectedCities.includes(cityId)
      ? internalSelectedCities.filter((id) => id !== cityId)
      : [...internalSelectedCities, cityId];

    setInternalSelectedCities(newSelected);
    onSelectedChange?.(newSelected);
  };

  const firstFiveCities = data.cities.slice(0, 5);
  const remainingCities = data.cities.slice(5);

  return (
    <div className={s.container}>
      <div className={s.citiesCheckboxContainer}>
        {firstFiveCities.map((item: any) => (
          <CheckboxOption
            key={item.id}
            label={item.name}
            value={item.id.toString()}
            checked={internalSelectedCities.includes(item.id)}
            onChange={() => handleCityChange(item.id)}
          />
        ))}
      </div>

      {remainingCities.length > 0 && (
        <>
          {isExpanded && (
            <div className={s.otherCities}>
              <div className={s.citiesCheckboxContainer}>
                {remainingCities.map((item: any) => (
                  <CheckboxOption
                    key={item.id}
                    label={item.name}
                    value={item.id.toString()}
                    checked={internalSelectedCities.includes(item.id)}
                    onChange={() => handleCityChange(item.id)}
                  />
                ))}
              </div>
            </div>
          )}
          <button className={s.toggleButton} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Свернуть' : `Все города `}
            {isExpanded ? (
              <img src="/icons/chevron-up.svg" className={s.iconChevron} />
            ) : (
              <img src="/icons/chevron-down.svg" className={s.iconChevron} />
            )}
          </button>
        </>
      )}
    </div>
  );
};
