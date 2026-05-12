import { useState, useEffect, useRef } from 'react';
import s from './Autocomplete.module.css';

interface IAutocomplete {
  options: string[];
  placeholder?: string;
}

export const Autocomplete = ({ options, placeholder = 'Введите текст...' }: IAutocomplete) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredOptions([]);
      setIsOpen(false);
      return;
    }

    // Фильтруем, исключая точное совпадение
    const filtered = options.filter((option: string) => {
      const matchesPrefix = option.toLowerCase().startsWith(inputValue.toLowerCase());
      const isExactMatch = option.toLowerCase() === inputValue.toLowerCase();
      return matchesPrefix && !isExactMatch;
    });

    setFilteredOptions(filtered);
    setIsOpen(filtered.length > 0);
    setActiveIndex(-1);
  }, [inputValue, options]);

  const hasExactMatch = (value: string): boolean => {
    return options.some((option) => option.toLowerCase() === value.toLowerCase());
  };

  const handleFocus = () => {
    if (inputValue.trim() === '') {
      setFilteredOptions(options);
      setIsOpen(options.length > 0);
    } else {
      const filtered = options.filter((option: string) => {
        const matchesPrefix = option.toLowerCase().startsWith(inputValue.toLowerCase());
        const isExactMatch = option.toLowerCase() === inputValue.toLowerCase();
        return matchesPrefix && !isExactMatch;
      });
      setFilteredOptions(filtered);
      setIsOpen(filtered.length > 0);
    }
  };

  const handleSelect = (value: string) => {
    setInputValue(value);
    setIsOpen(false);
    setFilteredOptions([]);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && e.key === 'Enter' && inputValue.trim() !== '') {
      if (hasExactMatch(inputValue)) {
        e.preventDefault();
        setIsOpen(false);
      }
      return;
    }

    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev: number) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev: number) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();

      if (activeIndex >= 0 && filteredOptions[activeIndex]) {
        handleSelect(filteredOptions[activeIndex]);
      } else if (hasExactMatch(inputValue)) {
        setIsOpen(false);
        setFilteredOptions([]);
        setActiveIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  return (
    <div ref={wrapperRef} className={s.autocomplete_container}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={s.input}
        onFocus={handleFocus}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className={s.options}>
          {filteredOptions.map((option: string, index: number) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setActiveIndex(index)}
              className={index === activeIndex ? s.active : ''}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
