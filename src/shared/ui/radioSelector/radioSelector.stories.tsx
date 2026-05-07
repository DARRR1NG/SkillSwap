import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioSelector } from './radioSelector';

const meta = {
  title: 'RadioSelector',
  component: RadioSelector,
  tags: ['autodocs'],
} satisfies Meta<typeof RadioSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: [{ text: '123', selected: true, onClick: () => {} }],
  },
};
