import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Footer } from '../../widgets/Footer';
import { Header } from '../../widgets/Header';
import { FilterColumn } from '../../widgets/FilterColumn/index';
import { UserCard } from '../../widgets/userCard/userCard';
import type { TUser } from '../../utils/types';
import styles from './HomePage.module.css';

type UsersResponse = { users: TUser[] };
type Skill = { id: number; title: string; categoryId: number };

const TOP_LIMIT = 6;
const INITIAL_SHORT_LIST_SIZE = 3;
const RECOMMENDED_BATCH_SIZE = 9;

export function HomePage() {
  const [cards, setCards] = useState<TUser[]>([]);
  const [filteredCards, setFilteredCards] = useState<TUser[]>([]);
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const [popularOpen, setPopularOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [recommendedVisible, setRecommendedVisible] = useState(RECOMMENDED_BATCH_SIZE);

  // Состояния для фильтров
  const [wantCanValue, setWantCanValue] = useState<'all' | 'want' | 'can'>('all');
  const [genderValue, setGenderValue] = useState<'all' | 'male' | 'female'>('all');
  const [selectedCities, setSelectedCities] = useState<number[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const handleRegisterClick = () => {
    navigate('/reg');
  };

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      const usersResponse = await fetch(`${import.meta.env.BASE_URL}db/users.json`);
      const skillsResponse = await fetch(`${import.meta.env.BASE_URL}db/skills.json`);

      const usersData = (await usersResponse.json()) as UsersResponse;
      const skillsData = (await skillsResponse.json()) as Skill[];

      setSkillsList(skillsData);
      setCards(usersData.users ?? []);
    };

    loadData().catch(() => {
      setCards([]);
    });
  }, []);

  // Поиск по пользователю
  const searchInUser = (user: TUser, query: string) => {
    if (!query.trim()) return true;

    const searchLower = query.toLowerCase().trim();

    if (user.name.toLowerCase().includes(searchLower)) return true;

    if (
      user.skillsCanTeach?.some((skill) => skill.customTitle?.toLowerCase().includes(searchLower))
    )
      return true;

    if (user.skillsWantId && user.skillsWantId.length > 0) {
      for (const id of user.skillsWantId) {
        const skill = skillsList.find((s) => s.id === Number(id));
        if (skill?.title.toLowerCase().includes(searchLower)) return true;
      }
    }

    return false;
  };

  // Флаг - применены ли фильтры
  const isFiltered =
    wantCanValue !== 'all' ||
    genderValue !== 'all' ||
    selectedSkills.length > 0 ||
    selectedCities.length > 0 ||
    searchQuery.trim() !== '';

  // Применение фильтров
  useEffect(() => {
    if (cards.length === 0) return;
    if (skillsList.length === 0) return;

    const filtered = cards.filter((user) => {
      // Поиск
      if (!searchInUser(user, searchQuery)) return false;

      // Фильтр по навыкам
      if (selectedSkills.length > 0) {
        if (wantCanValue === 'want') {
          const canTeachCategories =
            user.skillsCanTeach?.map((s) => ({
              categoryId: s.categoryId,
              subcategoryId: s.subcategoryId,
            })) || [];

          const hasSkill = selectedSkills.some((skillId) => {
            const selectedSkill = skillsList.find((s) => s.id === Number(skillId));
            if (!selectedSkill) return false;
            return canTeachCategories.some(
              (cat) =>
                cat.categoryId === selectedSkill.categoryId &&
                cat.subcategoryId === selectedSkill.id
            );
          });
          if (!hasSkill) return false;
        } else if (wantCanValue === 'can') {
          const wantIds = user.skillsWantId?.map((id) => Number(id)) || [];
          const hasSkill = selectedSkills.some((id) => wantIds.includes(Number(id)));
          if (!hasSkill) return false;
        } else {
          const wantIds = user.skillsWantId?.map((id) => Number(id)) || [];
          const canTeachCategories =
            user.skillsCanTeach?.map((s) => ({
              categoryId: s.categoryId,
              subcategoryId: s.subcategoryId,
            })) || [];

          const hasInWant = selectedSkills.some((id) => wantIds.includes(Number(id)));
          const hasInCanTeach = selectedSkills.some((skillId) => {
            const selectedSkill = skillsList.find((s) => s.id === Number(skillId));
            if (!selectedSkill) return false;
            return canTeachCategories.some(
              (cat) =>
                cat.categoryId === selectedSkill.categoryId &&
                cat.subcategoryId === selectedSkill.id
            );
          });

          if (!hasInWant && !hasInCanTeach) return false;
        }
      }

      // Фильтр по полу
      if (genderValue !== 'all' && user.gender !== genderValue) return false;

      // Фильтр по городу
      if (selectedCities.length > 0 && !selectedCities.includes(user.cityId)) return false;

      return true;
    });

    setFilteredCards(filtered);
  }, [cards, skillsList, searchQuery, wantCanValue, genderValue, selectedSkills, selectedCities]);

  // Следим за инпутом поиска в хедере
  useEffect(() => {
    const searchInput = document.querySelector(
      'input[placeholder="Искать навык"]'
    ) as HTMLInputElement;
    if (!searchInput) return;

    const handleInput = (e: Event) => {
      setSearchQuery((e.target as HTMLInputElement).value);
    };

    searchInput.addEventListener('input', handleInput);

    return () => {
      searchInput.removeEventListener('input', handleInput);
    };
  }, []);

  // Результат: если фильтры применены - показываем отфильтрованные, иначе все
  const displayCards = isFiltered ? filteredCards : cards;
  const hasNoResults = isFiltered && filteredCards.length === 0;

  const popularCards = useMemo(
    () => [...displayCards].sort((a, b) => b.likes - a.likes).slice(0, TOP_LIMIT),
    [displayCards]
  );

  const newestCards = useMemo(
    () =>
      [...displayCards]
        .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)))
        .slice(0, TOP_LIMIT),
    [displayCards]
  );

  const excludedIds = useMemo(() => {
    const ids = new Set<number>();
    popularCards.forEach((card) => ids.add(card.id));
    newestCards.forEach((card) => ids.add(card.id));
    return ids;
  }, [popularCards, newestCards]);

  const recommendedCards = useMemo(
    () => displayCards.filter((card) => !excludedIds.has(card.id)),
    [displayCards, excludedIds]
  );

  const visibleRecommendedCards = recommendedCards.slice(0, recommendedVisible);
  const hasMoreRecommended = recommendedVisible < recommendedCards.length;

  useEffect(() => {
    if (!hasMoreRecommended) return;

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
            <FilterColumn
              wantCanValue={wantCanValue}
              setWantCanValue={setWantCanValue}
              genderValue={genderValue}
              setGenderValue={setGenderValue}
              selectedCities={selectedCities}
              setSelectedCities={setSelectedCities}
              selectedSkills={selectedSkills}
              setSelectedSkills={setSelectedSkills}
            />
          </div>
        </aside>

        <div className={styles.content}>
          {hasNoResults ? (
            <>
              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>Популярное</h2>
                </div>
                <div className={styles.emptyMessage}>
                  <p>Никто не подошёл...</p>
                  <p className={styles.emptySubtext}>
                    Попробуйте изменить параметры фильтрации или поиска
                  </p>
                </div>
              </section>

              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>Новое</h2>
                </div>
                <div className={styles.emptyMessage}>
                  <p>Никто не подошёл...</p>
                  <p className={styles.emptySubtext}>
                    Попробуйте изменить параметры фильтрации или поиска
                  </p>
                </div>
              </section>

              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>Рекомендуем</h2>
                </div>
                <div className={styles.emptyMessage}>
                  <p>Никто не подошёл...</p>
                  <p className={styles.emptySubtext}>
                    Попробуйте изменить параметры фильтрации или поиска
                  </p>
                </div>
              </section>
            </>
          ) : (
            <>
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
                  {newestCards
                    .slice(0, newOpen ? TOP_LIMIT : INITIAL_SHORT_LIST_SIZE)
                    .map((card) => (
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
