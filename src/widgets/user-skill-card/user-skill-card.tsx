import clsx from 'clsx';
import { useEffect, useState, type HTMLAttributes } from 'react';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styles from './user-skill-card.module.css';
import type { SkillTag, UserSkillCardSkill, UserSkillCardUser } from './user-skill-card.types';

export type UserSkillCardProps = {
  user: UserSkillCardUser;
  skill: UserSkillCardSkill;
  currentImageIndex?: number;
  defaultCurrentImageIndex?: number;
  onImageIndexChange?: (index: number) => void;
  onOfferExchange?: () => void;
  onLike?: () => void;
  onShare?: () => void;
  onMore?: () => void;
} & HTMLAttributes<HTMLElement>;

const thumbnailsLimit = 3;

const getSafeImageIndex = (index: number, imagesCount: number) => {
  if (imagesCount === 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), imagesCount - 1);
};

const pluralizeAge = (age: number): string => {
  const mod10 = age % 10;
  const mod100 = age % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'лет';
  if (mod10 === 1) return 'год';
  if (mod10 >= 2 && mod10 <= 4) return 'года';
  return 'лет';
};

type TagsProps = {
  tags: SkillTag[];
  variant: 'teach' | 'learn';
};

const Tags = ({ tags, variant }: TagsProps) => {
  if (tags.length === 0) {
    return <span className={styles.emptyText}>Не указано</span>;
  }

  return (
    <ul className={clsx(styles.tags, variant === 'teach' ? styles.tags_teach : styles.tags_learn)}>
      {tags.map((tag) => (
        <li className={styles.tag} key={tag.id}>
          {tag.title}
        </li>
      ))}
    </ul>
  );
};

export const UserSkillCard = ({
  user,
  skill,
  currentImageIndex,
  defaultCurrentImageIndex = 0,
  onImageIndexChange,
  onOfferExchange,
  onLike,
  onShare,
  onMore,
  className,
  ...rest
}: UserSkillCardProps) => {
  const safeDefaultImageIndex = getSafeImageIndex(defaultCurrentImageIndex, skill.images.length);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(safeDefaultImageIndex);
  const [mainSwiper, setMainSwiper] = useState<SwiperInstance | null>(null);
  const thumbnails = skill.images.slice(0, thumbnailsLimit);
  const activeThumbnailIndex =
    thumbnails.length > 0 ? Math.min(selectedSlideIndex, thumbnails.length - 1) : 0;
  const hiddenImagesCount = Math.max(skill.images.length - thumbnailsLimit, 0);
  const hasImages = skill.images.length > 0;

  const handleSlideChange = (swiper: SwiperInstance) => {
    const nextIndex = swiper.realIndex;
    setSelectedSlideIndex(nextIndex);
    onImageIndexChange?.(nextIndex);
  };

  useEffect(() => {
    if (mainSwiper && currentImageIndex !== undefined && skill.images.length > 0) {
      const safeCurrentImageIndex = getSafeImageIndex(currentImageIndex, skill.images.length);

      setSelectedSlideIndex(safeCurrentImageIndex);
      mainSwiper.slideToLoop(safeCurrentImageIndex);
    }
  }, [mainSwiper, currentImageIndex, skill.images.length]);

  return (
    <section
      className={clsx(styles.wrapper, className)}
      aria-label={`Предложение навыка ${skill.title}`}
      {...rest}
    >
      <aside className={styles.userCard}>
        <div className={styles.userHeader}>
          <img
            className={styles.avatar}
            src={user.avatar}
            alt={`Аватар пользователя ${user.name}`}
          />
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user.name}</p>
            <p className={styles.userMeta}>
              {user.city}
              {user.age !== null ? `, ${user.age} ${pluralizeAge(user.age)}` : ''}
            </p>
          </div>
        </div>

        <p className={styles.userDescription}>{user.description}</p>

        <div className={styles.skillGroup}>
          <h3 className={styles.groupTitle}>Может научить</h3>
          <Tags tags={user.canTeach} variant="teach" />
        </div>

        <div className={styles.skillGroup}>
          <h3 className={styles.groupTitle}>Хочет научиться</h3>
          <Tags tags={user.wantsToLearn} variant="learn" />
        </div>
      </aside>

      <article className={styles.offerCard}>
        <div className={styles.content}>
          <div className={styles.details}>
            <p className={styles.breadcrumb}>
              {skill.category}
              {skill.subcategory ? ` / ${skill.subcategory}` : ''}
            </p>
            <h2 className={styles.title}>{skill.title}</h2>
            <p className={styles.description}>{skill.description}</p>

            <button className={styles.offerButton} type="button" onClick={onOfferExchange}>
              Предложить обмен
            </button>
          </div>

          <div className={styles.gallery}>
            <div className={styles.mainImageFrame}>
              {hasImages ? (
                <Swiper
                  className={styles.mainImageBox}
                  initialSlide={safeDefaultImageIndex}
                  loop={skill.images.length > 1}
                  onSlideChange={handleSlideChange}
                  onSwiper={(swiper) => {
                    setMainSwiper(swiper);
                    setSelectedSlideIndex(swiper.realIndex);
                  }}
                >
                  {skill.images.map((image) => (
                    <SwiperSlide className={styles.mainImageSlide} key={image.id}>
                      <img className={styles.mainImage} src={image.src} alt={image.alt} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div
                  className={clsx(styles.mainImageBox, styles.placeholder)}
                  role="img"
                  aria-label="Изображение навыка отсутствует"
                >
                  Нет изображения
                </div>
              )}

              {skill.images.length > 1 && (
                <>
                  <button
                    className={clsx(styles.galleryButton, styles.galleryButtonLeft)}
                    type="button"
                    aria-label="Показать предыдущее изображение"
                    onClick={() => mainSwiper?.slidePrev()}
                  >
                    ‹
                  </button>
                  <button
                    className={clsx(styles.galleryButton, styles.galleryButtonRight)}
                    type="button"
                    aria-label="Показать следующее изображение"
                    onClick={() => mainSwiper?.slideNext()}
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {thumbnails.length > 0 && (
              <Swiper
                className={styles.thumbnails}
                direction="vertical"
                slidesPerView={3}
                spaceBetween={20}
                watchSlidesProgress
                aria-label="Миниатюры изображений навыка"
              >
                {thumbnails.map((image, index) => {
                  const showCounter = index === thumbnailsLimit - 1 && hiddenImagesCount > 0;

                  return (
                    <SwiperSlide className={styles.thumbnailItem} key={image.id}>
                      <button
                        className={clsx(
                          styles.thumbnailButton,
                          index === activeThumbnailIndex && styles.thumbnailButtonActive
                        )}
                        type="button"
                        aria-label={
                          showCounter
                            ? `Показать изображение ${index + 1} (ещё ${hiddenImagesCount})`
                            : `Показать изображение ${index + 1}`
                        }
                        aria-pressed={index === activeThumbnailIndex}
                        onClick={() => mainSwiper?.slideToLoop(index)}
                      >
                        <img
                          className={styles.thumbnail}
                          src={image.src}
                          alt=""
                          aria-hidden="true"
                        />
                        {showCounter && (
                          <span className={styles.counter} aria-hidden="true">
                            +{hiddenImagesCount}
                          </span>
                        )}
                      </button>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.actionButton} type="button" aria-label="Лайк" onClick={onLike}>
            <img src={`${import.meta.env.BASE_URL}icons/like-icon.svg`} alt="" aria-hidden="true" />
          </button>
          <button
            className={styles.actionButton}
            type="button"
            aria-label="Поделиться"
            onClick={onShare}
          >
            <img src={`${import.meta.env.BASE_URL}icons/share.svg`} alt="" aria-hidden="true" />
          </button>
          <button
            className={styles.actionButton}
            type="button"
            aria-label="Открыть меню"
            onClick={onMore}
          >
            <img
              src={`${import.meta.env.BASE_URL}icons/more-square.svg`}
              alt=""
              aria-hidden="true"
            />
          </button>
        </div>
      </article>
    </section>
  );
};
