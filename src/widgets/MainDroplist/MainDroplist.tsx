import { useEffect, useRef, useState } from 'react';
import './MainDroplist.css';

interface Subcategory {
  id?: number;
  title?: string;
}

interface Category {
  id: number;
  title: string;
  icon?: string;
  bgColor?: string;
  subcategories: (string | Subcategory)[];
}

export const MainDroplist = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/db/skills.json')
      .then((response) => {
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          setCategories([]);
        }
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
                {category.icon && <img src={category.icon} alt="" className="category-icon" />}
              </div>

              <div className="category-content">
                <h2 className="category-title">{category.title}</h2>
                <ul className="subcategories-list">
                  {category.subcategories.map((sub, index) => {
                    const title = typeof sub === 'object' && sub !== null ? sub.title : sub;
                    return (
                      <li key={index} className="subcategory-item">
                        <p className="subcategory-text">{title}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
