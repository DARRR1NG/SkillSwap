import { useEffect, useMemo, useRef, useState } from 'react';
import { Footer } from '../../widgets/Footer';
import { Header } from '../../widgets/Header';
import { FilterColumn } from '../../widgets/FilterColumn/index';
import { UserCard } from '../../widgets/userCard/userCard';
import type { TUser } from '../../utils/types';
import styles from './HomePage.module.css';

type UsersResponse = { users: TUser[] };

const TOP_LIMIT = 6;
const INITIAL_SHORT_LIST_SIZE = 3;
const RECOMMENDED_BATCH_SIZE = 9;

export function HomePage() {
  const [cards, setCards] = useState<TUser[]>([]);
  const [popularOpen, setPopularOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [recommendedVisible, setRecommendedVisible] = useState(RECOMMENDED_BATCH_SIZE);
  const handleLoginClick = () => {};
  const handleRegisterClick = () => {};

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const usersResponse = await fetch('/db/users.json');

      if (!usersResponse.ok) {
        throw new Error('Не удалось загрузить данные главной страницы');
      }

      const usersData = (await usersResponse.json()) as UsersResponse;
      setCards(usersData.users ?? []);
    };

    loadData().catch(() => {
      setCards([]);
    });
  }, []);

  const popularCards = useMemo(
    () => [...cards].sort((a, b) => b.likes - a.likes).slice(0, TOP_LIMIT),
    [cards]
  );

  const newestCards = useMemo(
    () =>
      [...cards]
        .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)))
        .slice(0, TOP_LIMIT),
    [cards]
  );

  const excludedIds = useMemo(() => {
    const ids = new Set<number>();
    popularCards.forEach((card) => ids.add(card.id));
    newestCards.forEach((card) => ids.add(card.id));
    return ids;
  }, [popularCards, newestCards]);

  const recommendedCards = useMemo(
    () => cards.filter((card) => !excludedIds.has(card.id)),
    [cards, excludedIds]
  );

  const visibleRecommendedCards = recommendedCards.slice(0, recommendedVisible);
  const hasMoreRecommended = recommendedVisible < recommendedCards.length;

  useEffect(() => {
    if (!hasMoreRecommended) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRecommendedVisible((current) =>
            Math.min(current + RECOMMENDED_BATCH_SIZE, recommendedCards.length)
          );
        }
      },
      {
        rootMargin: '0px 0px 300px 0px',
      }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      observer.disconnect();
    };
  }, [recommendedCards.length, hasMoreRecommended]);

  return (
    <div className={styles.page}>
      <Header onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
      <main className={styles.main}>
        <aside className={styles.filtersSlot}>
          <div className={styles.filtersCard}>
            <FilterColumn />
          </div>
        </aside>

        <div className={styles.content}>
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Популярное</h2>
              {!popularOpen && popularCards.length > INITIAL_SHORT_LIST_SIZE && (
                <button
                  type="button"
                  className={styles.showAllButton}
                  onClick={() => setPopularOpen(true)}
                >
                  Смотреть все <span className={styles.showAllArrow}>›</span>
                </button>
              )}
            </div>

            <div className={styles.cardsGrid}>
              {popularCards
                .slice(0, popularOpen ? TOP_LIMIT : INITIAL_SHORT_LIST_SIZE)
                .map((card) => (
                  <UserCard key={`popular-${card.id}`} user={card} />
                ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Новое</h2>
              {!newOpen && newestCards.length > INITIAL_SHORT_LIST_SIZE && (
                <button
                  type="button"
                  className={styles.showAllButton}
                  onClick={() => setNewOpen(true)}
                >
                  Смотреть все <span className={styles.showAllArrow}>›</span>
                </button>
              )}
            </div>

            <div className={styles.cardsGrid}>
              {newestCards.slice(0, newOpen ? TOP_LIMIT : INITIAL_SHORT_LIST_SIZE).map((card) => (
                <UserCard key={`new-${card.id}`} user={card} />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Рекомендуем</h2>
            </div>

            <div className={styles.cardsGrid}>
              {visibleRecommendedCards.map((card) => (
                <UserCard key={`recommended-${card.id}`} user={card} />
              ))}
            </div>

            {hasMoreRecommended && (
              <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
