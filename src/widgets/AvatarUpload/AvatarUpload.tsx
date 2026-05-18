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
import avatarIcon from '../../images/icon/avatar.svg';
import chevronPlusIcon from '../../images/icon/chevron-plus.svg';
import s from './AvatarUpload.module.css';

export type AvatarUploadVariant = 'register' | 'profile';

export type AvatarUploadProps = {
  /** Регистрация и профиль без фото: avatar.svg + «+»; профиль с фото: gallery-edit. */
  variant?: AvatarUploadVariant;
  src?: string | null;
  defaultSrc?: string | null;
  className?: string;
  disabled?: boolean;
  avatarSize?: number;
  editButtonSize?: number;
  accept?: string;
  onFileChange?: (file: File) => void;
  'aria-label'?: string;
};

const defaultSizeByVariant: Record<AvatarUploadVariant, number> = {
  register: 54,
  profile: 244,
};

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
  const isEmpty = !displaySrc;
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
  const badgeInset = Math.round(6 + ((avatarSize - 54) / (244 - 54)) * (4 - 6));
  const profileEditGlyphPx = Math.round((badgeDiameter * 22) / 56);
  const registerPlusSize = Math.round((16 / 54) * avatarSize);
  const registerPlusNudge = Math.max(
    0,
    Math.round((avatarSize / 2) * (1 - Math.SQRT2 / 2) - registerPlusSize / 2)
  );

  return (
    <div className={clsx(s.root, className)}>
      <button
        type="button"
        className={s.hitArea}
        style={
          {
            width: avatarSize,
            height: avatarSize,
            '--register-plus-size': `${registerPlusSize}px`,
            '--register-plus-nudge': `${registerPlusNudge}px`,
          } as CSSProperties
        }
        disabled={disabled}
        aria-label={resolvedAriaLabel}
        onClick={openPicker}
      >
        <span
          className={clsx(s.avatarWrap, isEmpty && s.avatarWrapEmpty)}
          style={{ width: avatarSize, height: avatarSize }}
          aria-hidden="true"
        >
          {displaySrc ? (
            <img className={s.avatar} src={displaySrc} alt="" draggable={false} />
          ) : (
            <img className={s.emptyPlaceholder} src={avatarIcon} alt="" draggable={false} />
          )}
        </span>

        {showProfileEdit ? (
          <span
            className={s.editButton}
            style={{
              width: badgeDiameter,
              height: badgeDiameter,
              right: badgeInset,
              bottom: badgeInset,
            }}
            aria-hidden="true"
          >
            <img
              className={s.editIcon}
              src="/icons/gallery-edit.svg"
              alt=""
              draggable={false}
              width={profileEditGlyphPx}
              height={profileEditGlyphPx}
            />
          </span>
        ) : (
          <img
            className={s.registerPlus}
            src={chevronPlusIcon}
            alt=""
            draggable={false}
            aria-hidden="true"
          />
        )}
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
