import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AvatarUpload } from './AvatarUpload';

const meta = {
  title: 'widgets/AvatarUpload',
  component: AvatarUpload,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: 'var(--background)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AvatarUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {},
};

export const WithPhoto: Story = {
  args: {
    defaultSrc: '/images/avatars/alexander.jpg',
  },
};

/** Макет профиля: 244 и бейдж 56 (можно не передавать — посчитается само). */
export const ProfileSize: Story = {
  args: {
    defaultSrc: '/images/avatars/alexander.jpg',
    avatarSize: 244,
  },
};

/** Меньший аватар — диаметр бейджа по пропорции 56/244. */
export const Compact: Story = {
  args: {
    defaultSrc: '/images/avatars/alexander.jpg',
    avatarSize: 160,
  },
};

export const Controlled: Story = {
  render: () => {
    const [src, setSrc] = useState<string | null>(null);
    return (
      <AvatarUpload
        src={src}
        avatarSize={180}
        onFileChange={(file) => {
          setSrc(URL.createObjectURL(file));
        }}
      />
    );
  },
};
