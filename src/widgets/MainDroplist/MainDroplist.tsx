import { useState, useEffect } from 'react';
import './MainDroplist.css';
import '../../shared/lib/fonts/fonts.css';

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

  const [isOpen] = useState(true);

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

  return (
    <div className="main-droplist-container">
      <div className="dropdown-trigger">Все навыки</div>

      {isOpen && (
        <div className="dropdown-menu">
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
