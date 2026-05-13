import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProfileNavigate } from './ProfileNavigate';

const meta = {
  title: 'ProfileNavigate',
  component: ProfileNavigate,
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileNavigate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProfileNavigateComponent: Story = {
  args: {},
};
