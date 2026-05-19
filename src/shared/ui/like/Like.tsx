import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { IconButton } from '../IconButton';
import s from './Like.module.css';

interface LikeProps {
  userId: number;
}

const FAVORITES_KEY = 'skillswap_favorites';

// Кастомное событие для обновления избранного в других компонентах
export const FAVORITES_UPDATED_EVENT = 'favoritesUpdated';

export const Like: FC<LikeProps> = ({ userId }) => {
  const [isLiked, setIsLiked] = useState(false);

  // Загрузка состояния из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      const favorites = JSON.parse(saved) as number[];
      setIsLiked(favorites.includes(userId));
    }
  }, [userId]);

  const handleLike = () => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    let favorites: number[] = saved ? JSON.parse(saved) : [];

    if (isLiked) {
      // Удаляем из избранного
      favorites = favorites.filter((id) => id !== userId);
    } else {
      // Добавляем в избранное
      if (!favorites.includes(userId)) {
        favorites.push(userId);
      }
    }

    // Сохраняем в localStorage
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    setIsLiked(!isLiked);

    // Диспатчим событие, чтобы другие компоненты узнали об изменении
    window.dispatchEvent(
      new CustomEvent(FAVORITES_UPDATED_EVENT, {
        detail: { favorites, userId, isLiked: !isLiked },
      })
    );
  };

  return (
    <IconButton
      onClick={handleLike}
      src={isLiked ? '/icons/like-fill.svg' : '/icons/like-icon.svg'}
      className={s.likeButton}
    />
  );
};
