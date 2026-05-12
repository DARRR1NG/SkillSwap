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

  // Фильтрация вариантов при вводе
  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredOptions([]);
      setIsOpen(false);
      return;
    }

    const filtered = options.filter((option: string) =>
      option.toLowerCase().startsWith(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setIsOpen(filtered.length > 0);
    setActiveIndex(-1);
  }, [inputValue, options]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    if (inputValue.trim() === '') {
      setFilteredOptions(options);
      setIsOpen(true);
    } else {
      const filtered = options.filter((option: string) =>
        option.toLowerCase().startsWith(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
      setIsOpen(filtered.length > 0);
    }
  };

  const handleSelect = (value: string) => {
    setInputValue(value);
    setIsOpen(false);
    setFilteredOptions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev: number) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev: number) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredOptions[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className={s.autocomplete_container}>
      <input
        type="text"
        value={inputValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={s.input}
        onFocus={handleFocus}
      />
      {isOpen && (
        <ul className={s.options}>
          {filteredOptions.map((option: string, index: number) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
