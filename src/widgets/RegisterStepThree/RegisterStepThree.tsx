import { useMemo, useState, type FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { completeRegistration } from '../../store/slices/authSlice';
import chevronDownIcon from '../../images/icon/chevron-down.svg';
import styles from './RegisterStepThree.module.css';

export type RegisterStepThreeProps = {
  onBack?: () => void;
  onContinue?: () => void;
};

type OpenDropdown = 'category' | 'subcategory' | null;

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

const getFileText = (files: File[]) => {
  if (files.length === 0) {
    return 'Перетащите или выберите изображения навыка';
  }
  return files.length === 1 ? files[0].name : `Выбрано файлов: ${files.length}`;
};

export const RegisterStepThree = ({ onBack, onContinue }: RegisterStepThreeProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const subcategories = useMemo(
    () => skills.find((skill) => skill.category === category)?.subcategories ?? [],
    [category]
  );

  const toggleDropdown = (dropdown: OpenDropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleCategorySelect = (nextCategory: string) => {
    setCategory(nextCategory);
    setSubcategory('');
    setOpenDropdown(null);
  };

  const handleFiles = (fileList: FileList | null) => {
    setImages(fileList ? Array.from(fileList) : []);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Завершаем регистрацию
    const skillsCanTeach = title
      ? [
          {
            id: Date.now(),
            categoryId: skills.findIndex((s) => s.category === category) + 1,
            subcategoryId: 0,
            customTitle: title,
            description: description,
            images: [],
          },
        ]
      : [];

    dispatch(completeRegistration({ skillsCanTeach }));

    // После регистрации переходим на главную
    onContinue?.();
    navigate('/');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span className={styles.label}>Название навыка</span>
        <input
          className={styles.control}
          value={title}
          type="text"
          placeholder="Введите название вашего навыка"
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>

      <div className={`${styles.field} ${openDropdown === 'category' ? styles.openField : ''}`}>
        <span className={styles.label}>Категория навыка</span>
        <button
          className={styles.controlButton}
          type="button"
          onClick={() => toggleDropdown('category')}
        >
          <span className={category ? '' : styles.placeholder}>
            {category || 'Выберите категорию навыка'}
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
              <button
                className={styles.dropdownItem}
                key={skill.category}
                type="button"
                onClick={() => handleCategorySelect(skill.category)}
              >
                {skill.category}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={`${styles.field} ${openDropdown === 'subcategory' ? styles.openField : ''}`}>
        <span className={styles.label}>Подкатегория навыка</span>
        <button
          className={styles.controlButton}
          type="button"
          onClick={() => toggleDropdown('subcategory')}
          disabled={!category}
        >
          <span className={subcategory ? '' : styles.placeholder}>
            {subcategory || 'Выберите подкатегорию навыка'}
          </span>
          <img
            className={openDropdown === 'subcategory' ? styles.upIcon : styles.downIcon}
            src={chevronDownIcon}
            alt=""
          />
        </button>

        {openDropdown === 'subcategory' && (
          <div className={styles.dropdown}>
            {subcategories.map((item) => (
              <button
                className={styles.dropdownItem}
                key={item}
                type="button"
                onClick={() => {
                  setSubcategory(item);
                  setOpenDropdown(null);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Описание</span>
        <textarea
          className={styles.textarea}
          value={description}
          placeholder="Коротко опишите, чему можете научить"
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>

      <label
        className={`${styles.upload} ${isDragActive ? styles.uploadActive : ''}`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragActive(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragActive(false);
          handleFiles(event.dataTransfer.files);
        }}
      >
        <input
          className={styles.fileInput}
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => handleFiles(event.target.files)}
        />
        <span className={styles.uploadText}>{getFileText(images)}</span>
        <span className={styles.uploadAction}>Выбрать изображения</span>
      </label>

      <div className={styles.buttons}>
        <button className={styles.backButton} type="button" onClick={onBack}>
          Назад
        </button>
        <button className={styles.continueButton} type="submit">
          Завершить
        </button>
      </div>
    </form>
  );
};
