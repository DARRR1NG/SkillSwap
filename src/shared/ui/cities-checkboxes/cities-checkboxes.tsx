import { useState } from 'react';
import { CheckboxOption } from '../skill-checkboxes/skill-checkboxes';
import data from '../../../../public/db/cities.json';
import s from './cities-checkboxes.module.css';

export const CitiesCheckboxes = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  const handleCityChange = (cityId: string) => {
    setSelectedCities((prev) =>
      prev.includes(cityId) ? prev.filter((id) => id !== cityId) : [...prev, cityId]
    );
  };

  // Разделяем города: первые 5 и остальные
  const firstFiveCities = data.cities.slice(0, 5);
  const remainingCities = data.cities.slice(5);

  return (
    <div className={s.container}>
      {/* Первые 5 городов всегда видны */}
      <div className={s.citiesCheckboxContainer}>
        {firstFiveCities.map((item) => (
          <CheckboxOption
            key={item.id}
            label={item.name}
            value={item.id.toString()}
            checked={selectedCities.includes(item.id.toString())}
            onChange={() => handleCityChange(item.id.toString())}
          />
        ))}
      </div>

      {/* Кнопка для показа остальных городов */}
      {remainingCities.length > 0 && (
        <>
          {/* Остальные города, показываются при нажатии */}
          {isExpanded && (
            <div className={s.otherCities}>
              <div className={s.citiesCheckboxContainer}>
                {remainingCities.map((item) => (
                  <CheckboxOption
                    key={item.id}
                    label={item.name}
                    value={item.id.toString()}
                    checked={selectedCities.includes(item.id.toString())}
                    onChange={() => handleCityChange(item.id.toString())}
                  />
                ))}
              </div>
            </div>
          )}
          <button className={s.toggleButton} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Свернуть' : `Все города `}
            {isExpanded ? (
              <img src="public\icons\chevron-up.svg" className={s.iconChevron} />
            ) : (
              <img src="public\icons\chevron-down.svg" className={s.iconChevron} />
            )}
          </button>
        </>
      )}
    </div>
  );
};
