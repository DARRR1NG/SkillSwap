import clsx from 'clsx';
import { type MouseEvent, type ReactNode, useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../button';
import s from './modal.module.css';

export type ModalIconPreset = 'check' | 'user';

export type ModalAction = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
};

export type ModalProps = {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  description?: ReactNode;
  /** Встроенные иконки или свой ReactNode; `null` — без иконки. */
  icon?: ReactNode | ModalIconPreset | null;
  children?: ReactNode;
  /** Свой футер; если не задан — рендерятся `actions`. */
  footer?: ReactNode;
  actions?: ModalAction[];
  size?: 'sm' | 'lg';
  headerAlign?: 'center' | 'left';
  closeOnOverlayClick?: boolean;
  className?: string;
  panelClassName?: string;
};

const CheckIcon = () => (
  <img
    className={clsx(s.presetIcon, s.presetIconCheck)}
    src={`${import.meta.env.BASE_URL}icons/modal-check.svg`}
    alt=""
    width={77}
    height={77}
    draggable={false}
  />
);

const UserIcon = () => (
  <img
    className={clsx(s.presetIcon, s.presetIconCheck)}
    src={`${import.meta.env.BASE_URL}icons/modal-user.svg`}
    alt=""
    width={77}
    height={77}
    draggable={false}
  />
);

const renderIcon = (icon: ModalProps['icon']) => {
  if (icon == null) {
    return null;
  }
  if (icon === 'check') {
    return <CheckIcon />;
  }
  if (icon === 'user') {
    return <UserIcon />;
  }
  return icon;
};

export const Modal = ({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  footer,
  actions,
  size = 'sm',
  headerAlign = 'center',
  closeOnOverlayClick = true,
  className,
  panelClassName,
}: ModalProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const blockScroll = (event: Event) => {
      event.preventDefault();
    };

    const html = document.documentElement;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);
    window.addEventListener('wheel', blockScroll, { passive: false });
    window.addEventListener('touchmove', blockScroll, { passive: false });

    return () => {
      html.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('wheel', blockScroll);
      window.removeEventListener('touchmove', blockScroll);
    };
  }, [open, handleEscape]);

  if (!open) {
    return null;
  }

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlayClick || !onClose) {
      return;
    }
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const hasHeader = Boolean(title || description || icon);
  const hasFooter = Boolean(footer || (actions && actions.length > 0));
  /** Макет success: иконка | текст | кнопка с gap 52px на панели. */
  const useCenteredSmLayout = size === 'sm' && headerAlign === 'center' && !children;

  const footerContent =
    footer ??
    (actions && actions.length > 0 ? (
      <div className={clsx(s.actions, size === 'sm' ? s.actionsColumn : s.actionsRow)}>
        {actions.map((action) => (
          <Button
            key={action.label}
            type="button"
            className={clsx(s.actionButton, size === 'sm' && s.actionButtonFull)}
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
    ) : null);

  return createPortal(
    <div className={clsx(s.overlay, className)} onClick={handleOverlayClick} role="presentation">
      <div
        ref={panelRef}
        className={clsx(s.panel, size === 'lg' ? s.panelLg : s.panelSm, panelClassName)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
      >
        {hasHeader && useCenteredSmLayout ? (
          <>
            {icon != null ? (
              <div className={s.iconWrap} aria-hidden="true">
                {renderIcon(icon)}
              </div>
            ) : null}
            {title || description ? (
              <header className={s.textBlockCenter}>
                {title ? (
                  <h2 className={s.title} id={titleId}>
                    {title}
                  </h2>
                ) : null}
                {description ? (
                  <p className={s.description} id={descriptionId}>
                    {description}
                  </p>
                ) : null}
              </header>
            ) : null}
          </>
        ) : hasHeader ? (
          <header className={clsx(s.header, headerAlign === 'center' && s.headerCenter)}>
            {icon != null ? <div className={s.iconWrap}>{renderIcon(icon)}</div> : null}
            {title ? (
              <h2 className={s.title} id={titleId}>
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className={s.description} id={descriptionId}>
                {description}
              </p>
            ) : null}
          </header>
        ) : null}

        {children ? <div className={s.body}>{children}</div> : null}

        {hasFooter ? <footer className={s.footer}>{footerContent}</footer> : null}
      </div>
    </div>,
    document.body
  );
};
