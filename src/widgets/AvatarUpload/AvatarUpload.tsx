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
import s from './AvatarUpload.module.css';

export type AvatarUploadProps = {
  /** URL превью (контролируемый режим). */
  src?: string | null;
  /** Начальное изображение при неконтролируемом режиме. */
  defaultSrc?: string | null;
  className?: string;
  disabled?: boolean;
  /** Диаметр аватара в px (макет профиля — 244). */
  avatarSize?: number;
  /** Диаметр круга с иконкой, px. По умолчанию — как в макете: 56 при аватаре 244, иначе × (56/244). */
  editButtonSize?: number;
  accept?: string;
  onFileChange?: (file: File) => void;
  'aria-label'?: string;
};

export const AvatarUpload = ({
  src: srcProp,
  defaultSrc = null,
  className,
  disabled = false,
  avatarSize = 244,
  editButtonSize,
  accept = 'image/jpeg,image/png,image/webp,image/gif',
  onFileChange,
  'aria-label': ariaLabel = 'Загрузить или сменить фото',
}: AvatarUploadProps) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const blobRef = useRef<string | null>(null);
  const isControlled = srcProp !== undefined;
  const [internalSrc, setInternalSrc] = useState<string | null>(defaultSrc ?? null);

  const displaySrc = isControlled ? (srcProp ?? null) : internalSrc;

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

  /** Макет: круг 56×56 при аватаре 244; иначе пропорция 56/244, если размер не задан явно. */
  const badgeDiameter = editButtonSize ?? Math.round((56 / 244) * avatarSize);
  /** В Figma 24×24 — контейнер глифа; в зелёном круге он визуально крупнее (~46% диаметра бейджа). */
  const glyphPx = Math.round(badgeDiameter * 0.464);

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
        aria-label={ariaLabel}
        onClick={openPicker}
      >
        <span
          className={s.avatarWrap}
          style={{ width: avatarSize, height: avatarSize }}
          aria-hidden="true"
        >
          {displaySrc ? (
            <img className={s.avatar} src={displaySrc} alt="" draggable={false} />
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
          className={s.editButton}
          style={{
            width: badgeDiameter,
            height: badgeDiameter,
            right: 0,
            bottom: 0,
          }}
          aria-hidden="true"
        >
          <img
            className={s.editIcon}
            src="/icons/gallery-edit.svg"
            alt=""
            draggable={false}
            width={glyphPx}
            height={glyphPx}
          />
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
