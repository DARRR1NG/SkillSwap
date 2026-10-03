import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { Modal } from './modal';
import { ModalOfferPreview } from './modal-offer-preview';

const meta = {
  title: 'Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    open: false,
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const offerCoverImage = 'images/skills/offer-preview/main.jpg';

/** Порядок миниатюр: цветная рубашка → окно/горы → ч/б с «+3». */
const offerThumbImages = [
  'images/skills/offer-preview/thumb-1.jpg',
  'images/skills/offer-preview/thumb-2.jpg',
  'images/skills/offer-preview/thumb-3.jpg',
  'images/skills/offer-preview/extra-1.jpg',
  'images/skills/offer-preview/extra-2.jpg',
  'images/skills/drums2.jpg',
];

const offerDescription =
  'Привет! Я играю на барабанах уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без партитуры';

const ModalDemo = (props: Omit<ComponentProps<typeof Modal>, 'open' | 'onClose'>) => {
  const [open, setOpen] = useState(true);
  const close = () => setOpen(false);

  const actions = props.actions?.map((action) => ({
    ...action,
    onClick: () => {
      action.onClick();
      close();
    },
  }));

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Открыть
      </button>
      <Modal {...props} actions={actions} open={open} onClose={close} />
    </>
  );
};

const OfferPreviewDemo = () => {
  const [open, setOpen] = useState(true);
  const close = () => setOpen(false);

  const offerActions = [
    {
      label: 'Редактировать',
      variant: 'secondary' as const,
      onClick: close,
      icon: <img src={`${import.meta.env.BASE_URL}icons/edit.svg`} alt="" />,
    },
    { label: 'Готово', onClick: close },
  ];

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Открыть
      </button>
      <Modal
        open={open}
        onClose={close}
        size="lg"
        headerAlign="center"
        title="Ваше предложение"
        description="Пожалуйста, проверьте и подтвердите правильность данных"
      >
        <ModalOfferPreview
          title="Игра на барабанах"
          category="Творчество и искусство / Музыка и звук"
          description={offerDescription}
          coverImage={offerCoverImage}
          images={offerThumbImages}
          actions={offerActions}
        />
      </Modal>
    </>
  );
};

/** Успех — как в макете: галочка в круге, «Готово». */
export const SuccessCheck: Story = {
  render: () => (
    <ModalDemo
      icon="check"
      title="Ваше предложение создано"
      description="Теперь вы можете предложить обмен"
      actions={[{ label: 'Готово', onClick: () => undefined }]}
    />
  ),
};

/** Успех: иконка пользователя (альтернатива из макета). */
export const SuccessUser: Story = {
  render: () => (
    <ModalDemo
      icon="user"
      title="Ваше предложение создано"
      description="Теперь вы можете предложить обмен"
      actions={[{ label: 'Готово', onClick: () => undefined }]}
    />
  ),
};

/** Превью предложения перед публикацией (макет). */
export const OfferPreview: Story = {
  render: () => <OfferPreviewDemo />,
};
