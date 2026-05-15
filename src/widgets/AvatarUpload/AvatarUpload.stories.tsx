import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AvatarUpload } from './AvatarUpload';

const meta = {
  title: 'widgets/AvatarUpload',
  component: AvatarUpload,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 24 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AvatarUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Регистрация: силуэт + «+» (54px). */
export const Register: Story = {
  args: {
    variant: 'register',
  },
};

/** Профиль: фото + иконка редактирования (244px). */
export const Profile: Story = {
  args: {
    variant: 'profile',
    defaultSrc: '/images/avatars/alexander.jpg',
  },
};

/** Профиль без фото. */
export const ProfileEmpty: Story = {
  args: {
    variant: 'profile',
  },
};

export const Controlled: Story = {
  render: () => {
    const [src, setSrc] = useState<string | null>(null);
    return (
      <AvatarUpload
        variant="profile"
        src={src}
        onFileChange={(file) => {
          setSrc(URL.createObjectURL(file));
        }}
      />
    );
  },
};
