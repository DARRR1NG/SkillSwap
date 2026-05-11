import type { Meta, StoryObj } from '@storybook/react-vite';
import { MainDroplist } from './MainDroplist';

const meta = {
  title: 'widgets/MainDroplist',
  component: MainDroplist,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MainDroplist>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
