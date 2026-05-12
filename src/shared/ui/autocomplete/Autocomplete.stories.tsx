import type { Meta, StoryObj } from '@storybook/react-vite';
import { Autocomplete } from './Autocomplete';

const meta = {
  title: 'Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AutocompleteExample: Story = {
  args: {
    options: [
      'Яблоко',
      'Груша',
      'Банан',
      'Апельсин',
      'Мандарин',
      'Киви',
      'Ананас',
      'Арбуз',
      'Дыня',
      'Вишня',
    ],
    placeholder: 'Начните вводить...',
  },
};
