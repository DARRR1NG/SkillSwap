import clsx from 'clsx';
import { useState } from 'react';
import { Button } from '../button';
import type { ModalAction } from './modal';
import s from './modal.module.css';

export type ModalOfferPreviewProps = {
  title: string;
  category: string;
  description: string;
  /** Большое фото слева по умолчанию. */
  coverImage: string;
  /** Миниатюры справа сверху вниз (порядок как в макете). */
  images: string[];
  maxVisibleThumbs?: number;
  actions?: ModalAction[];
};

export const ModalOfferPreview = ({
  title,
  category,
  description,
  coverImage,
  images,
  maxVisibleThumbs = 3,
  actions,
}: ModalOfferPreviewProps) => {
  const [mainSrc, setMainSrc] = useState(coverImage);
  const visibleThumbs = images.slice(0, maxVisibleThumbs);
  const hiddenCount = Math.max(0, images.length - maxVisibleThumbs);

  return (
    <div className={s.offerLayout}>
      <div className={s.offerColumn}>
        <div className={s.offerInfo}>
          <h3 className={s.offerTitle}>{title}</h3>
          <p className={s.offerMeta}>{category}</p>
          <p className={s.offerText}>{description}</p>
        </div>
        {actions && actions.length > 0 ? (
          <div className={s.offerActions}>
            {actions.map((action) => (
              <Button
                key={action.label}
                type="button"
                className={s.offerActionButton}
                color={action.variant === 'secondary' ? 'white' : 'green'}
                onClick={action.onClick}
              >
                <span className={s.actionLabel}>
                  {action.label}
                  {action.icon ? <span className={s.actionIcon}>{action.icon}</span> : null}
                </span>
              </Button>
            ))}
          </div>
        ) : null}
      </div>

      <div className={s.offerGallery}>
        {mainSrc ? (
          <img className={s.offerMainImage} src={mainSrc} alt="" draggable={false} />
        ) : null}
        <div className={s.offerThumbs}>
          {visibleThumbs.map((src, index) => {
            const isLast = index === visibleThumbs.length - 1 && hiddenCount > 0;

            return (
              <button
                key={`${src}-${index}`}
                type="button"
                className={clsx(s.offerThumb, mainSrc === src && s.offerThumbActive)}
                onClick={() => setMainSrc(src)}
              >
                <img src={src} alt="" draggable={false} />
                {isLast ? <span className={s.offerThumbMore}>+{hiddenCount}</span> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
