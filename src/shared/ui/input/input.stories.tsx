import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './input';

const meta = {
  title: 'Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Введите значение',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 552, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Имя',
    placeholder: 'Введите ваш пароль',
    hint: 'Пароль должен содержать не менее 8 знаков',
  },
};

export const Focused: Story = {
  args: {
    label: 'Имя',
    placeholder: 'Введите ваш пароль',
    hint: 'Пароль должен содержать не менее 8 знаков',
    autoFocus: true,
  },
};

export const Filled: Story = {
  args: {
    label: 'Имя',
    defaultValue: 'Введите',
    placeholder: 'Введите ваш пароль',
    hint: 'Пароль должен содержать не менее 8 знаков',
  },
};

export const Password: Story = {
  args: {
    label: 'Имя',
    type: 'password',
    placeholder: 'Введите ваш пароль',
    hint: 'Пароль должен содержать не менее 8 знаков',
  },
};

export const PasswordFilled: Story = {
  args: {
    label: 'Имя',
    type: 'password',
    defaultValue: 'Введите ваш пароль',
    placeholder: 'Введите ваш пароль',
    hint: 'Пароль должен содержать не менее 8 знаков',
  },
};

export const PasswordError: Story = {
  args: {
    label: 'Имя',
    type: 'password',
    defaultValue: 'Введите ваш пароль',
    placeholder: 'Введите ваш пароль',
    error: 'Пароль должен содержать не менее 8 знаков',
  },
};

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
