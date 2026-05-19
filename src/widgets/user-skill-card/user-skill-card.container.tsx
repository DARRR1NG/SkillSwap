import clsx from 'clsx';
import type { HTMLAttributes } from 'react';
import { UserSkillCard, type UserSkillCardProps } from './user-skill-card';
import styles from './user-skill-card.module.css';
import type { UserSkillCardData, UserSkillCardQuery } from './user-skill-card.types';
import { useUserSkillCardData } from './use-user-skill-card-data';

export type UserSkillCardContainerProps = UserSkillCardQuery &
  Omit<UserSkillCardProps, 'user' | 'skill'> & {
    initialData?: UserSkillCardData;
    skipInitialLoad?: boolean;
  };

const StatusMessage = ({
  title,
  text,
  action,
  className,
  ...rest
}: {
  title: string;
  text: string;
  action?: {
    label: string;
    onClick: () => void;
  };
} & HTMLAttributes<HTMLElement>) => (
  <section className={clsx(styles.wrapper, styles.stateCard, className)} {...rest}>
    <div className={styles.stateContent}>
      <h2 className={styles.stateTitle}>{title}</h2>
      <p className={styles.stateText}>{text}</p>
      {action && (
        <button className={styles.stateButton} type="button" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  </section>
);

export const UserSkillCardContainer = ({
  userId,
  skillId,
  initialData,
  skipInitialLoad,
  className,
  ...cardProps
}: UserSkillCardContainerProps) => {
  const { status, data, error, retry } = useUserSkillCardData({
    userId,
    skillId,
    initialData,
    skipInitialLoad,
  });

  if (status === 'loading') {
    return (
      <StatusMessage
        className={className}
        title="Загружаем карточку"
        text="Данные пользователя и навыка скоро появятся."
        role="status"
        aria-busy="true"
      />
    );
  }

  if (status === 'error') {
    return (
      <StatusMessage
        className={className}
        title="Не удалось загрузить карточку"
        text={error}
        role="alert"
        action={{
          label: 'Повторить',
          onClick: retry,
        }}
      />
    );
  }

  if (status === 'empty') {
    return (
      <StatusMessage
        className={className}
        title="Карточка не найдена"
        text="Для выбранного пользователя или навыка пока нет данных."
      />
    );
  }

  return <UserSkillCard {...cardProps} className={className} user={data.user} skill={data.skill} />;
};
