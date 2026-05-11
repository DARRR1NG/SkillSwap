import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './input';

const meta = {
  title: 'Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Введите значение',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Search: Story = {
  args: {
    variant: 'search',
    placeholder: 'Искать навык',
    'aria-label': 'Искать навык',
  },
};

export const SearchLarge: Story = {
  args: {
    variant: 'search',
    inputSize: 'lg',
    placeholder: 'Искать навык',
    'aria-label': 'Искать навык',
  },
};

export const EmailError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    defaultValue: 'petrov@mail.ru',
    error: 'Email уже используется',
  },
};

export const Password: Story = {
  args: {
    label: 'Пароль',
    type: 'password',
    defaultValue: 'Чер5нослив)',
    hint: 'Надёжный',
  },
};
