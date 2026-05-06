import styles from './Like.module.css';

export type LikeProps =
  | {
      /**
       * Лайк на карточке пользователя.
       * Логика сохранения/роутинга должна жить выше (Redux/Router), тут только UI.
       */
      variant: 'card';
      /** Активное состояние (лайк поставлен) */
      active: boolean;
      /** Незалогиненный пользователь не может взаимодействовать */
      isAuthorized: boolean;
      /** Клик по лайку (вынесено наверх) */
      onClick?: () => void;
      className?: string;
    }
  | {
      /**
       * Лайк в шапке (иконка избранного).
       * Навигация должна быть выше (Router), тут только UI.
       */
      variant: 'header';
      /** Подсветить, если есть избранное/уведомления (опционально) */
      active?: boolean;
      /** Клик по иконке (вынесено наверх) */
      onClick?: () => void;
      className?: string;
    };

function likeButtonLabel(isAuthorized: boolean, active: boolean, isHeader: boolean): string {
  if (!isAuthorized) {
    return isHeader ? 'Избранное' : 'Войдите, чтобы поставить лайк';
  }
  if (isHeader) {
    return 'Избранное';
  }
  return active ? 'Убрать лайк' : 'Поставить лайк';
}

export function Like(props: LikeProps) {
  const isHeader = props.variant === 'header';
  const isAuthorized = isHeader ? true : props.isAuthorized;
  const active = isHeader ? Boolean(props.active) : props.active;
  const disabled = !isHeader && !isAuthorized;

  const iconId = active ? 'like-filled' : 'like-outline';
  const label = likeButtonLabel(isAuthorized, active, isHeader);
  const titleHint = !isHeader && !isAuthorized ? label : undefined;

  const onClick = () => {
    if (!isHeader && !isAuthorized) {
      return;
    }
    props.onClick?.();
  };

  return (
    <div className={`${styles.root} ${props.className ?? ''}`.trim()}>
      <button
        type="button"
        className={`${styles.button} ${active ? styles.buttonActive : ''}`.trim()}
        disabled={disabled}
        aria-pressed={!isHeader ? active : undefined}
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
