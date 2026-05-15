import clsx from 'clsx';
import {
  type ChangeEvent,
  type CSSProperties,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import avatarPlaceholderIcon from '../../images/icon/avatar.svg';
import s from './AvatarUpload.module.css';

export type AvatarUploadVariant = 'register' | 'profile';

export type AvatarUploadProps = {
  /** Регистрация: «+» на бейдже; профиль: иконка редактирования. */
  variant?: AvatarUploadVariant;
  /** URL превью (контролируемый режим). */
  src?: string | null;
  /** Начальное изображение при неконтролируемом режиме. */
  defaultSrc?: string | null;
  className?: string;
  disabled?: boolean;
  /** Диаметр аватара в px (регистрация — 54, профиль — 244). */
  avatarSize?: number;
  /** Диаметр круга с иконкой, px. По умолчанию — пропорция 56/244 от avatarSize. */
  editButtonSize?: number;
  accept?: string;
  onFileChange?: (file: File) => void;
  'aria-label'?: string;
};

const defaultSizeByVariant: Record<AvatarUploadVariant, number> = {
  register: 54,
  profile: 244,
};

const PlusIcon = ({ size }: { size: number }) => (
  <svg
    className={s.badgeGlyph}
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 8.5H4C3.72667 8.5 3.5 8.27333 3.5 8C3.5 7.72667 3.72667 7.5 4 7.5H12C12.2733 7.5 12.5 7.72667 12.5 8C12.5 8.27333 12.2733 8.5 12 8.5Z"
      fill="currentColor"
    />
    <path
      d="M8 12.5C7.72667 12.5 7.5 12.2733 7.5 12V4C7.5 3.72667 7.72667 3.5 8 3.5C8.27333 3.5 8.5 3.72667 8.5 4V12C8.5 12.2733 8.27333 12.5 8 12.5Z"
      fill="currentColor"
    />
  </svg>
);

export const AvatarUpload = ({
  variant = 'profile',
  src: srcProp,
  defaultSrc = null,
  className,
  disabled = false,
  avatarSize: avatarSizeProp,
  editButtonSize,
  accept = 'image/jpeg,image/png,image/webp,image/gif',
  onFileChange,
  'aria-label': ariaLabel,
}: AvatarUploadProps) => {
  const avatarSize = avatarSizeProp ?? defaultSizeByVariant[variant];
  const resolvedAriaLabel =
    ariaLabel ?? (variant === 'register' ? 'Добавить аватар' : 'Загрузить или сменить фото');

  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const blobRef = useRef<string | null>(null);
  const isControlled = srcProp !== undefined;
  const [internalSrc, setInternalSrc] = useState<string | null>(defaultSrc ?? null);

  const displaySrc = isControlled ? (srcProp ?? null) : internalSrc;
  const showProfileEdit = variant === 'profile' && Boolean(displaySrc);

  useEffect(() => {
    return () => {
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
        blobRef.current = null;
      }
    };
  }, []);

  const handleFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file || !file.type.startsWith('image/')) {
        return;
      }
      if (isControlled) {
        onFileChange?.(file);
        return;
      }
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
      }
      const url = URL.createObjectURL(file);
      blobRef.current = url;
      setInternalSrc(url);
      onFileChange?.(file);
    },
    [isControlled, onFileChange]
  );

  const openPicker = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const badgeDiameter = editButtonSize ?? Math.round((56 / 244) * avatarSize);
  /**
   * Отступ бейджа от угла: в макете 6px при 54px (регистрация) и ~4px при 244px (профиль).
   * Одна линейная шкала по avatarSize — оба варианта совпадают с Figma.
   */
  const badgeInset = Math.round(6 + ((avatarSize - 54) / (244 - 54)) * (4 - 6));
  /** Глиф gallery-edit 22×22 в бейдже 56×56; «+» на регистрации — 12×12 в бейдже 12×12. */
  const profileEditGlyphPx = Math.round((badgeDiameter * 22) / 56);
  const registerPlusGlyphPx = Math.round((badgeDiameter * 12) / 12);

  return (
    <div className={clsx(s.root, className)}>
      <button
        type="button"
        className={s.hitArea}
        style={
          {
            width: avatarSize,
            height: avatarSize,
          } as CSSProperties
        }
        disabled={disabled}
        aria-label={resolvedAriaLabel}
        onClick={openPicker}
      >
        <span
          className={s.avatarWrap}
          style={{ width: avatarSize, height: avatarSize }}
          aria-hidden="true"
        >
          {displaySrc ? (
            <img className={s.avatar} src={displaySrc} alt="" draggable={false} />
          ) : variant === 'register' ? (
            <img
              className={s.placeholderIcon}
              src={avatarPlaceholderIcon}
              alt=""
              draggable={false}
            />
          ) : (
            <span className={s.placeholder}>
              <svg width="52%" height="52%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M3 20c0-4 4-7 9-7s9 3 9 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          )}
        </span>

        <span
          className={clsx(s.editButton, variant === 'register' && s.editButtonRegister)}
          style={{
            width: badgeDiameter,
            height: badgeDiameter,
            right: badgeInset,
            bottom: badgeInset,
          }}
          aria-hidden="true"
        >
          {showProfileEdit ? (
            <img
              className={s.editIcon}
              src="/icons/gallery-edit.svg"
              alt=""
              draggable={false}
              width={profileEditGlyphPx}
              height={profileEditGlyphPx}
            />
          ) : (
            <PlusIcon size={registerPlusGlyphPx} />
          )}
        </span>
      </button>

      <input
        ref={inputRef}
        id={inputId}
        className={s.hiddenInput}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={handleFile}
      />
    </div>
  );
};
