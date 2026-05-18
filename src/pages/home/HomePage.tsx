import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const handleRegisterClick = () => {
    navigate('/reg');
  };

  useEffect(() => {
    const loadData = async () => {
      const usersResponse = await fetch('/db/users.json');
      const skillsResponse = await fetch('/db/skills.json');

      const usersData = (await usersResponse.json()) as UsersResponse;
      const skillsData = (await skillsResponse.json()) as Skill[];

      setSkillsList(skillsData);
      setCards(usersData.users ?? []);
    };

    loadData().catch(() => {
      setCards([]);
    });
  }, []);

  const getSearchQueryFromDOM = () => {
    const searchInput = document.querySelector(
      'input[placeholder="Искать навык"]'
    ) as HTMLInputElement;

    return searchInput ? searchInput.value : '';
  };

  const getFiltersFromDOM = () => {
    let wantCanValue = 'all';
    const allRadios = document.querySelectorAll('input[type="radio"]');

    allRadios.forEach((radio) => {
      if ((radio as HTMLInputElement).checked) {
        const label = radio.closest('label')?.innerText?.trim() || '';

        if (label === 'Хочу научиться') {
          wantCanValue = 'want';
        } else if (label === 'Могу научить') {
          wantCanValue = 'can';
        } else if (label === 'Все') {
          wantCanValue = 'all';
        }
      }
    });

    let genderValue = 'all';
    const genderContainer = document.querySelector('[class*="genders"]');

    if (genderContainer) {
      const radios = genderContainer.querySelectorAll('input[type="radio"]');

      radios.forEach((radio, index) => {
        if ((radio as HTMLInputElement).checked) {
          if (index === 1) {
            genderValue = 'male';
          } else if (index === 2) {
            genderValue = 'female';
          } else {
            genderValue = 'all';
          }
        }
      });
    }

    const selectedSkills: number[] = [];
    const skillsContainer = document.querySelector('[class*="skills"]');

    if (skillsContainer) {
      const checkboxes = skillsContainer.querySelectorAll('input[type="checkbox"]:checked');

      checkboxes.forEach((cb) => {
        const value = Number((cb as HTMLInputElement).value);

        if (value) {
          selectedSkills.push(value);
        }
      });
    }

    const selectedCities: number[] = [];
    const citiesContainer = document.querySelector('[class*="cities"]');

    if (citiesContainer) {
      const checkboxes = citiesContainer.querySelectorAll('input[type="checkbox"]:checked');

      checkboxes.forEach((cb) => {
        selectedCities.push(Number((cb as HTMLInputElement).value));
      });
    }

    return { wantCanValue, genderValue, selectedSkills, selectedCities };
  };

  const searchInUser = useCallback(
    (user: TUser, query: string) => {
      if (!query.trim()) {
        return true;
      }

      const searchLower = query.toLowerCase().trim();

      if (user.name.toLowerCase().includes(searchLower)) {
        return true;
      }

      if (
        user.skillsCanTeach?.some((skill) => skill.customTitle?.toLowerCase().includes(searchLower))
      ) {
        return true;
      }

      if (user.skillsWantId && user.skillsWantId.length > 0) {
        for (const id of user.skillsWantId) {
          const skill = skillsList.find((s) => s.id === Number(id));

          if (skill?.title.toLowerCase().includes(searchLower)) {
            return true;
          }
        }
      }

      return false;
    },
    [skillsList]
  );

  const applyFilters = useCallback(() => {
    if (cards.length === 0) {
      return;
    }

    if (skillsList.length === 0) {
      return;
    }

    const currentSearchQuery = getSearchQueryFromDOM();
    const { wantCanValue, genderValue, selectedSkills, selectedCities } = getFiltersFromDOM();

    const filtered = cards.filter((user) => {
      if (!searchInUser(user, currentSearchQuery)) {
        return false;
      }

      if (selectedSkills.length > 0) {
        if (wantCanValue === 'want') {
          const canTeachCategories =
            user.skillsCanTeach?.map((s) => ({
              categoryId: s.categoryId,
              subcategoryId: s.subcategoryId,
            })) || [];

          const hasSkill = selectedSkills.some((skillId) => {
            const selectedSkill = skillsList.find((s) => s.id === skillId);

            if (!selectedSkill) {
              return false;
            }

            return canTeachCategories.some(
              (cat) =>
                cat.categoryId === selectedSkill.categoryId &&
                cat.subcategoryId === selectedSkill.id
            );
          });

          if (!hasSkill) {
            return false;
          }
        } else if (wantCanValue === 'can') {
          const wantIds = user.skillsWantId?.map((id) => Number(id)) || [];
          const hasSkill = selectedSkills.some((id) => wantIds.includes(id));

          if (!hasSkill) {
            return false;
          }
        } else {
          const wantIds = user.skillsWantId?.map((id) => Number(id)) || [];
          const canTeachCategories =
            user.skillsCanTeach?.map((s) => ({
              categoryId: s.categoryId,
              subcategoryId: s.subcategoryId,
            })) || [];

          const hasInWant = selectedSkills.some((id) => wantIds.includes(id));
          const hasInCanTeach = selectedSkills.some((skillId) => {
            const selectedSkill = skillsList.find((s) => s.id === skillId);

            if (!selectedSkill) {
              return false;
            }

            return canTeachCategories.some(
              (cat) =>
                cat.categoryId === selectedSkill.categoryId &&
                cat.subcategoryId === selectedSkill.id
            );
          });

          if (!hasInWant && !hasInCanTeach) {
            return false;
          }
        }
      }

      if (genderValue !== 'all' && user.gender !== genderValue) {
        return false;
      }

      if (selectedCities.length > 0 && !selectedCities.includes(user.cityId)) {
        return false;
      }

      return true;
    });

    setFilteredCards(filtered);
  }, [cards, searchInUser, skillsList]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    if (cards.length === 0) {
      return;
    }

    const handleChange = () => {
      setTimeout(() => applyFilters(), 50);
    };

    document.addEventListener('click', handleChange);

    const searchInput = document.querySelector(
      'input[placeholder="Искать навык"]'
    ) as HTMLInputElement;

    if (searchInput) {
      searchInput.addEventListener('input', handleChange);
    }

    return () => {
      document.removeEventListener('click', handleChange);

      if (searchInput) {
        searchInput.removeEventListener('input', handleChange);
      }
    };
  }, [cards.length, applyFilters]);

  const displayCards = filteredCards.length > 0 ? filteredCards : cards;
  const hasNoResults = filteredCards.length === 0 && cards.length > 0;

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
