import { useState, useEffect } from 'react';

export const useFiltersState = () => {
  const [filters, setFilters] = useState({
    wantCanValue: 'all' as 'all' | 'want' | 'can',
    genderValue: 'all' as 'all' | 'male' | 'female',
  });

  useEffect(() => {
    // Получаем начальные значения из глобального объекта
    if ((window as any).__filters__) {
      setFilters((window as any).__filters__);
    }

    // Слушаем изменения фильтров
    const handleFiltersChange = (event: CustomEvent) => {
      setFilters(event.detail);
    };

    window.addEventListener('filtersChanged', handleFiltersChange as EventListener);

    return () => {
      window.removeEventListener('filtersChanged', handleFiltersChange as EventListener);
    };
  }, []);

  return filters;
};
