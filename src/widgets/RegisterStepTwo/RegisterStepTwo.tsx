import { forwardRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { ru } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import avatarIcon from '../../images/icon/avatar.svg';
import calendarIcon from '../../images/icon/calendar.svg';
import chevronDownIcon from '../../images/icon/chevron-down.svg';
import chevronPlusIcon from '../../images/icon/chevron-plus.svg';
import styles from './RegisterStepTwo.module.css';

type RegisterStepTwoData = {
  name: string;
  birthDate: string;
  gender: string;
  city: string;
  categories: string[];
  subcategories: string[];
};

type RegisterStepTwoProps = {
  onBack?: () => void;
  onContinue?: (data: RegisterStepTwoData) => void;
};

type OpenDropdown = 'gender' | 'city' | 'category' | 'subcategory' | null;

type DateButtonProps = {
  value?: string;
  onClick?: () => void;
};

const DateButton = forwardRef<HTMLButtonElement, DateButtonProps>(({ value, onClick }, ref) => (
  <button className={styles.controlButton} type="button" onClick={onClick} ref={ref}>
    <span className={value ? '' : styles.placeholder}>{value || 'дд.мм.гггг'}</span>
    <img className={styles.calendarIcon} src={calendarIcon} alt="" />
  </button>
));

DateButton.displayName = 'DateButton';

const genders = ['Не указан', 'Мужской', 'Женский'];

const cities = [
  'Москва',
  'Санкт-Петербург',
  'Самара',
  'Саратов',
  'Казань',
  'Краснодар',
  'Екатеринбург',
  'Новосибирск',
  'Нижний Новгород',
];

const skills = [
  {
    category: 'Бизнес и карьера',
    subcategories: ['Переговоры', 'Управление командой', 'Продажи', 'Личный бренд'],
  },
  {
    category: 'Творчество и искусство',
    subcategories: [
      'Рисование и иллюстрация',
      'Фотография',
      'Видеомонтаж',
      'Музыка и звук',
      'Актерское мастерство',
      'Креативное письмо',
      'Арт-терапия',
      'Декор и DIY',
    ],
  },
  {
    category: 'Иностранные языки',
    subcategories: ['Английский', 'Немецкий', 'Испанский', 'Французский'],
  },
  {
    category: 'Образование и развитие',
    subcategories: ['Публичные выступления', 'Планирование', 'Самообучение'],
  },
  {
    category: 'Здоровье и лайфстайл',
    subcategories: ['Йога', 'Питание', 'Медитация', 'Фитнес'],
  },
  {
    category: 'Дом и уют',
    subcategories: ['Организация пространства', 'Уход за растениями', 'Бытовые привычки'],
  },
];

const formatDate = (date: Date | null) => date?.toLocaleDateString('ru-RU') ?? '';
const getButtonText = (items: string[], placeholder: string) =>
  items.length > 1 ? `${items[0]} +${items.length - 1}` : items[0] || placeholder;

export const RegisterStepTwo = ({ onBack, onContinue }: RegisterStepTwoProps) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [gender, setGender] = useState('Не указан');
  const [city, setCity] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

  const filteredCities = cities.filter((item) => item.toLowerCase().includes(city.toLowerCase()));

  const selectedSubcategories =
    categories.length === 0
      ? skills.flatMap((skill) => skill.subcategories)
      : skills
          .filter((skill) => categories.includes(skill.category))
          .flatMap((skill) => skill.subcategories);

  const toggleDropdown = (dropdown: OpenDropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      const newCategories = categories.filter((item) => item !== category);
      const nextSubcategories = skills
        .filter((skill) => newCategories.includes(skill.category))
        .flatMap((skill) => skill.subcategories);

      setCategories(newCategories);
      setSubcategories(subcategories.filter((item) => nextSubcategories.includes(item)));
      return;
    }

    setCategories([...categories, category]);
  };

  const toggleSubcategory = (subcategory: string) => {
    setSubcategories(
      subcategories.includes(subcategory)
        ? subcategories.filter((item) => item !== subcategory)
        : [...subcategories, subcategory]
    );
  };

  const handleContinue = () => {
    onContinue?.({
      name,
      birthDate: formatDate(birthDate),
      gender,
      city,
      categories,
      subcategories,
    });
  };

  return (
    <section className={styles.card}>
      <button className={styles.avatarButton} type="button" aria-label="Добавить аватар">
        <img className={styles.avatar} src={avatarIcon} alt="" />
        <img className={styles.avatarPlus} src={chevronPlusIcon} alt="" />
      </button>

      <div className={styles.form}>
        <label className={styles.field}>
          <span className={styles.label}>Имя</span>
          <input
            className={styles.control}
            value={name}
            placeholder="Введите ваше имя"
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <div className={styles.row}>
          <div className={styles.field}>
            <span className={styles.label}>Дата рождения</span>
            <div className={styles.dateField}>
              <DatePicker
                selected={birthDate}
                onChange={(date: Date | null) => setBirthDate(date)}
                onCalendarOpen={() => setOpenDropdown(null)}
                locale={ru}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="dd.MM.yyyy"
                customInput={<DateButton />}
                wrapperClassName={styles.datePicker}
                calendarClassName={styles.calendar}
                popperClassName={styles.calendarPopper}
                popperPlacement="bottom-start"
                showPopperArrow={false}
              />
            </div>
          </div>

          <div className={`${styles.field} ${openDropdown === 'gender' ? styles.openField : ''}`}>
            <span className={styles.label}>Пол</span>
            <button
              className={styles.controlButton}
              type="button"
              onClick={() => toggleDropdown('gender')}
            >
              <span>{gender}</span>
              <img
                className={openDropdown === 'gender' ? styles.upIcon : styles.downIcon}
                src={chevronDownIcon}
                alt=""
              />
            </button>

            {openDropdown === 'gender' && (
              <div className={styles.dropdown}>
                {genders.map((item) => (
                  <button
                    className={styles.dropdownItem}
                    key={item}
                    type="button"
                    onClick={() => {
                      setGender(item);
                      setOpenDropdown(null);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={`${styles.field} ${openDropdown === 'city' ? styles.openField : ''}`}>
          <span className={styles.label}>Город</span>
          <div className={styles.cityField}>
            <input
              className={styles.control}
              value={city}
              placeholder="Не указан"
              onFocus={() => toggleDropdown('city')}
              onChange={(event) => {
                setCity(event.target.value);
                setOpenDropdown('city');
              }}
            />
            {city ? (
              <button className={styles.clearButton} type="button" onClick={() => setCity('')}>
                x
              </button>
            ) : (
              <img className={styles.downIcon} src={chevronDownIcon} alt="" />
            )}
          </div>

          {openDropdown === 'city' && (
            <div className={styles.dropdown}>
              {filteredCities.map((item) => (
                <button
                  className={styles.dropdownItem}
                  key={item}
                  type="button"
                  onClick={() => {
                    setCity(item);
                    setOpenDropdown(null);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={`${styles.field} ${openDropdown === 'category' ? styles.openField : ''}`}>
          <span className={styles.label}>Категория навыка, которому хотите научиться</span>
          <button
            className={styles.controlButton}
            type="button"
            onClick={() => toggleDropdown('category')}
          >
            <span className={categories.length ? '' : styles.placeholder}>
              {getButtonText(categories, 'Выберите категорию')}
            </span>
            <img
              className={openDropdown === 'category' ? styles.upIcon : styles.downIcon}
              src={chevronDownIcon}
              alt=""
            />
          </button>

          {openDropdown === 'category' && (
            <div className={styles.dropdown}>
              {skills.map((skill) => (
                <label className={styles.checkboxItem} key={skill.category}>
                  <input
                    type="checkbox"
                    checked={categories.includes(skill.category)}
                    onChange={() => toggleCategory(skill.category)}
                  />
                  <span>{skill.category}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div
          className={`${styles.field} ${openDropdown === 'subcategory' ? styles.openField : ''}`}
        >
          <span className={styles.label}>Подкатегория навыка, которому хотите научиться</span>
          <button
            className={styles.controlButton}
            type="button"
            onClick={() => toggleDropdown('subcategory')}
          >
            <span className={subcategories.length ? '' : styles.placeholder}>
              {getButtonText(subcategories, 'Выберите подкатегорию')}
            </span>
            <img
              className={openDropdown === 'subcategory' ? styles.upIcon : styles.downIcon}
              src={chevronDownIcon}
              alt=""
            />
          </button>

          {openDropdown === 'subcategory' && (
            <div className={styles.dropdown}>
              {selectedSubcategories.map((item) => (
                <label className={styles.checkboxItem} key={item}>
                  <input
                    type="checkbox"
                    checked={subcategories.includes(item)}
                    onChange={() => toggleSubcategory(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className={styles.buttons}>
          <button className={styles.backButton} type="button" onClick={onBack}>
            Назад
          </button>
          <button className={styles.continueButton} type="button" onClick={handleContinue}>
            Продолжить
          </button>
        </div>
      </div>
    </section>
  );
};
