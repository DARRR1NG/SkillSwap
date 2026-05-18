import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthForm } from './AuthForm';

const meta = {
  title: 'widgets/AuthForm',
  component: AuthForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 492, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuthForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithEmailError: Story = {
  args: {
    defaultEmail: 'petrov@mail.ru',
    defaultPassword: 'Чер5носолив',
    emailError: 'Email уже используется',
    passwordHint: 'Надёжный',
  },
};

export const DisabledSubmit: Story = {
  args: {
    defaultEmail: 'petrov@mail.ru',
    defaultPassword: 'Чер5носолив',
    isSubmitDisabled: true,
  },
};
