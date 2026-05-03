import { useAuthUserId } from '../../lib/auth-session';
import { useUsersDb } from '../../context/users-db-context';

import styles from './Like.module.css';

export type LikeProps = {
  /** Пользователь, чей счётчик лайков меняется */
  targetUserId: number;
  className?: string;
  /**
   * `true` (по умолчанию) — иконка и число в ряд, удобно в списках / демо.
   * `false` — только сердце, как в углу карточки в макете; число в aria/title.
   */
  showCount?: boolean;
};

function likeButtonLabel(isGuest: boolean, isSelf: boolean, liked: boolean): string {
  if (isGuest) {
    return 'Войдите, чтобы лайкнуть';
  }
  if (isSelf) {
    return 'Нельзя лайкнуть свой профиль';
  }
  return liked ? 'Убрать лайк' : 'Поставить лайк';
}

export function Like({ targetUserId, className, showCount = true }: LikeProps) {
  const authId = useAuthUserId();
  const { isReady, toggleLike, isLikedByCurrentUser, getLikes } = useUsersDb();

  const liked = isLikedByCurrentUser(targetUserId);
  const count = getLikes(targetUserId);
  const isGuest = authId === null;
  const isSelf = authId !== null && authId === targetUserId;
  const disabled = !isReady || isGuest || isSelf;

  const iconId = liked ? 'like-filled' : 'like-outline';
  const label = likeButtonLabel(isGuest, isSelf, liked);
  const ariaLabel =
    !showCount && isReady && !isGuest && !isSelf ? `${label}. Лайков: ${count}` : label;

  let titleHint: string | undefined;
  if (isGuest || isSelf) {
    titleHint = label;
  } else if (!showCount && isReady) {
    titleHint = `Лайков: ${count}`;
  }

  return (
    <div
      className={`${styles.root} ${showCount ? '' : styles.rootIconOnly} ${className ?? ''}`.trim()}
    >
      <button
        type="button"
        className={`${styles.button} ${liked ? styles.buttonActive : ''} ${showCount ? '' : styles.buttonIconOnly}`.trim()}
        disabled={disabled}
        aria-pressed={liked}
        aria-label={ariaLabel}
        title={titleHint}
        onClick={() => toggleLike(targetUserId)}
      >
        <svg className={styles.icon} role="presentation" aria-hidden="true" focusable="false">
          <use href={`/icons.svg#${iconId}`} />
        </svg>
      </button>
      {showCount ? (
        <span className={styles.count} aria-live="polite">
          {isReady ? count : '—'}
        </span>
      ) : null}
    </div>
  );
}
