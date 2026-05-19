import { useEffect, useState } from 'react';
import { Footer } from '../../widgets/Footer';
import { Header } from '../../widgets/Header';
import { UserCard } from '../../widgets/userCard/userCard';
import type { TUser } from '../../utils/types';
import styles from './FavoritesPage.module.css';

const FAVORITES_KEY = 'skillswap_favorites';

export const FavoritesPage = () => {
  const [favoriteUsers, setFavoriteUsers] = useState<TUser[]>([]);
  const [allUsers, setAllUsers] = useState<TUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoginClick = () => {};
  const handleRegisterClick = () => {};

  // Загрузка всех пользователей
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('/db/users.json');
        const data = await response.json();
        setAllUsers(data.users ?? []);
      } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Загрузка избранных и фильтрация
  useEffect(() => {
    if (allUsers.length === 0) return;

    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      const favoritesIds = JSON.parse(saved) as number[];
      const favorites = allUsers.filter((user) => favoritesIds.includes(user.id));
      setFavoriteUsers(favorites);
    } else {
      setFavoriteUsers([]);
    }
  }, [allUsers]);

  // Подписка на обновления лайков
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        const favoritesIds = JSON.parse(saved) as number[];
        const favorites = allUsers.filter((user) => favoritesIds.includes(user.id));
        setFavoriteUsers(favorites);
      } else {
        setFavoriteUsers([]);
      }
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
  }, [allUsers]);

  return (
    <div className={styles.page}>
      <Header onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Избранное</h1>

          {isLoading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : favoriteUsers.length === 0 ? (
            <div className={styles.empty}>
              <p>😢 У вас пока нет избранных карточек</p>
              <p className={styles.emptySubtext}>
                Добавьте карточки в избранное, нажав на сердечко
              </p>
            </div>
          ) : (
            <div className={styles.cardsGrid}>
              {favoriteUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
