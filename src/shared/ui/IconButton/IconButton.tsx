import styles from './IconButton.module.css';

export type iconButtonProps = {
  onClick: () => void;
  src: string;
  className?: string;
};

export const IconButton = ({ onClick, src, className }: iconButtonProps) => {
  return (
    <button type="button" className={`${styles.iconButton} ${className}`} onClick={onClick}>
      <img src={src} alt="кнопка иконка" className={styles.icon} />
    </button>
  );
};
