import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Textarea } from './textarea';

const meta = {
  title: 'shared/Textarea',
  component: Textarea,
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'О себе',
    placeholder: 'Напиши что-нибудь о себе...',
    name: 'about',
  },
};

export const FullWidth: Story = {
  args: {
    label: 'О себе',
    placeholder: 'Растягивается по ширине родителя',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithError: Story = {
  args: {
    label: 'О себе',
    defaultValue: 'Коротко',
    error: 'Расскажите о себе чуть подробнее',
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Textarea
        label="О себе"
        value={value}
        onValueChange={setValue}
        placeholder="Напиши что-нибудь о себе..."
      />
    );
  },
};

export const WithoutIcon: Story = {
  args: {
    label: 'Комментарий',
    rightIcon: null,
    placeholder: 'Без иконки справа',
  },
};
