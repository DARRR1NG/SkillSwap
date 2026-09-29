import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../widgets/Footer';
import { Header } from '../../widgets/Header';
import { UserCard } from '../../widgets/userCard/userCard';
import type { TUser } from '../../utils/types';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import type { RootState } from '../../store/store';
import styles from './FavoritesPage.module.css';

export const FavoritesPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [allUsers, setAllUsers] = useState<TUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const favoritesIds = useSelector((state: RootState) => state.favorites.favorites);

  const handleLoginClick = () => {
    navigate('/auth');
  };
  const handleRegisterClick = () => {
    navigate('/reg');
  };

  // Редирект на логин, если не авторизован
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('../../public/db/users.json');
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

  // Пока проверяем авторизацию - показываем загрузку
  if (!isAuthenticated && isLoading) {
    return (
      <div className={styles.page}>
        <Header onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
        <main className={styles.main}>
          <div className={styles.loading}>Загрузка...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const favoriteUsers = allUsers.filter((user) => favoritesIds.includes(user.id));

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
