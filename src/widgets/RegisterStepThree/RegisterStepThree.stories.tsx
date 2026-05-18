import type { Meta, StoryObj } from '@storybook/react-vite';
import { RegisterStepThree } from './RegisterStepThree';

const meta = {
  title: 'RegisterStepThree',
  component: RegisterStepThree,
  tags: ['autodocs'],
} satisfies Meta<typeof RegisterStepThree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
