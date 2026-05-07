import type { Meta, StoryObj } from '@storybook/react-vite';
import { MainDroplist } from './MainDroplist';

const meta = {
  title: 'MainDroplist',
  component: MainDroplist,
  tags: ['autodocs'],
} satisfies Meta<typeof MainDroplist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Search: Story = {};
