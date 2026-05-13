import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface FilterContextType {
  wantCanValue: 'all' | 'want' | 'can';
  setWantCanValue: (value: 'all' | 'want' | 'can') => void;
  genderValue: 'all' | 'male' | 'female';
  setGenderValue: (value: 'all' | 'male' | 'female') => void;
  selectedCities: number[];
  setSelectedCities: (cities: number[]) => void;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider = ({ children }: FilterProviderProps) => {
  const [wantCanValue, setWantCanValue] = useState<'all' | 'want' | 'can'>('all');
  const [genderValue, setGenderValue] = useState<'all' | 'male' | 'female'>('all');
  const [selectedCities, setSelectedCities] = useState<number[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  return (
    <FilterContext.Provider
      value={{
        wantCanValue,
        setWantCanValue,
        genderValue,
        setGenderValue,
        selectedCities,
        setSelectedCities,
        selectedSkills,
        setSelectedSkills,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within FilterProvider');
  }
  return context;
};
