import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageUploader } from './image-uploader';

const meta = {
  title: 'ImageUploader',
  component: ImageUploader,
  tags: ['autodocs'],
  args: {
    maxImages: 5,
    onImagesChange: (images) => console.log('Загружено изображений:', images.length),
  },
} satisfies Meta<typeof ImageUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Базовый компонент
export const Default: Story = {};

// С предзагруженными изображениями
export const WithInitialImages: Story = {
  args: {
    initialImages: ['images/skills/acting.jpg', 'images/skills/baking.jpg'],
  },
};
