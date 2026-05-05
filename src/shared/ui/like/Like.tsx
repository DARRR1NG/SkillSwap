import { toggleFavoriteCardId, useFavoriteCardIds } from '../../lib/favorites-storage';

import styles from './Like.module.css';

export type LikeProps =
  | {
      /**
       * `card` — лайк на карточке: toggle id в массиве избранного.
       * Незалогиненный пользователь не может взаимодействовать.
       */
      variant: 'card';
      cardId: number;
      /** Незалогиненный пользователь не может взаимодействовать */
      isAuthorized: boolean;
      className?: string;
    }
  | {
      /**
       * `header` — лайк в шапке: переход на роут избранного.
       */
      variant: 'header';
      /** Роут избранного */
      to?: string;
      className?: string;
    };

function likeButtonLabel(isAuthorized: boolean, liked: boolean, isHeader: boolean): string {
  if (!isAuthorized) {
    return isHeader ? 'Избранное' : 'Войдите, чтобы добавить в избранное';
  }
  if (isHeader) {
    return 'Избранное';
  }
  return liked ? 'Убрать из избранного' : 'Добавить в избранное';
}

export function Like(props: LikeProps) {
  const favoriteIds = useFavoriteCardIds();

  const isHeader = props.variant === 'header';
  const isAuthorized = isHeader ? true : props.isAuthorized;
  const liked = isHeader ? false : favoriteIds.includes(props.cardId);
  const disabled = !isHeader && !isAuthorized;

  const iconId = liked ? 'like-filled' : 'like-outline';
  const label = likeButtonLabel(isAuthorized, liked, isHeader);
  const titleHint = !isHeader && !isAuthorized ? label : undefined;

  const onClick = () => {
    if (isHeader) {
      const to = props.to ?? '/favorites';
      window.location.assign(to);
      return;
    }
    if (!isAuthorized) {
      return;
    }
    toggleFavoriteCardId(props.cardId);
  };

  return (
    <div className={`${styles.root} ${className ?? ''}`.trim()}>
      <button
        type="button"
        className={`${styles.button} ${liked ? styles.buttonActive : ''}`.trim()}
        disabled={disabled}
        aria-pressed={!isHeader ? liked : undefined}
        aria-label={label}
        title={titleHint}
        onClick={onClick}
      >
        <svg className={styles.icon} role="presentation" aria-hidden="true" focusable="false">
          <use href={`/icons.svg#${iconId}`} />
        </svg>
      </button>
    </div>
  );
}
