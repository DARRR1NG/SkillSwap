import { useEffect, useRef, useState } from 'react';
import './MainDroplist.css';
import '../../shared/lib/fonts/fonts.css';

interface Skill {
  id: number;
  title: string;
  categoryId: number;
}

interface Subcategory {
  id: number;
  title: string;
}

interface CategoryMeta {
  id: number;
  title: string;
  icon: string;
  bgColor: string;
}

interface Category extends CategoryMeta {
  subcategories: Subcategory[];
}

type SkillsResponse = Skill[] | { data: Category[] };

const CATEGORY_METAS: CategoryMeta[] = [
  {
    id: 1,
    title: 'Бизнес и карьера',
    icon: '/icons/briefcase.svg',
    bgColor: 'var(--tag_business)',
  },
  {
    id: 2,
    title: 'Иностранные языки',
    icon: '/icons/global.svg',
    bgColor: 'var(--tag_languages)',
  },
  {
    id: 3,
    title: 'Дом и уют',
    icon: '/icons/home.svg',
    bgColor: 'var(--tag_home)',
  },
  {
    id: 4,
    title: 'Творчество и искусство',
    icon: '/icons/palette.svg',
    bgColor: 'var(--tag_art)',
  },
  {
    id: 5,
    title: 'Образование и развитие',
    icon: '/icons/book.svg',
    bgColor: 'var(--tag_education)',
  },
  {
    id: 6,
    title: 'Здоровье и лайфстайл',
    icon: '/icons/lifestyle.svg',
    bgColor: 'var(--tag_health)',
  },
];

const mapFlatSkillsToCategories = (skills: Skill[]): Category[] => {
  return CATEGORY_METAS.map((category) => ({
    ...category,
    subcategories: skills
      .filter((skill) => skill.categoryId === category.id)
      .map((skill) => ({ id: skill.id, title: skill.title })),
  }));
};

export const MainDroplist = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}db/skills.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        return response.json() as Promise<SkillsResponse>;
      })
      .then((skillsData) => {
        if (Array.isArray(skillsData)) {
          setCategories(mapFlatSkillsToCategories(skillsData));
          return;
        }

        if (skillsData && Array.isArray(skillsData.data)) {
          setCategories(skillsData.data);
          return;
        }

        setCategories([]);
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const root = rootRef.current;
      const target = e.target as Node | null;
      if (!root || !target) return;
      if (!root.contains(target)) {
        setIsOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="main-droplist-container">
      <button
        type="button"
        className="dropdown-trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
      >
        Все навыки
      </button>

      {isOpen && (
        <div className="dropdown-menu" role="menu">
          {categories.map((category) => (
            <div key={category.id} className="category-block">
              <div className="category-icon-wrapper" style={{ backgroundColor: category.bgColor }}>
                <img src={category.icon} alt="" className="category-icon" />
              </div>

              <div className="category-content">
                <h2 className="category-title">{category.title}</h2>
                <ul className="subcategories-list">
                  {category.subcategories.map((subcategory) => (
                    <li key={subcategory.id} className="subcategory-item">
                      <p className="subcategory-text">{subcategory.title}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
