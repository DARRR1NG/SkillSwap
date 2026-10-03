import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserCard } from './userCard';
import type { TUser } from '../../utils/types';

const data: TUser = {
  id: 1,
  name: 'Александр',
  email: 'alexander@example.com',
  password: 'pass123',
  userAvatar: 'images/avatars/alexander.jpg',
  cityId: 1,
  gender: 'male',
  birthday: '1990-05-15',
  createdAt: '2025-01-15',
  about:
    'Привет! Я программист с 7-летним стажем, преподаю веб-разработку в онлайн-школе. Обожаю кофе по утрам, горы и новые технологии. Верю, что каждый может научиться программировать, если найти правильный подход. Помогу освоить JavaScript с нуля и не брошу на середине пути!',
  skillsWantId: ['1', '36', '15', '42'],
  likes: 156,
  skillsCanTeach: [
    {
      id: 101,
      categoryId: 1,
      subcategoryId: 1,
      customTitle: 'Управление IT-командой',
      description:
        'Привет! Я руководил командами разработки от 3 до 15 человек в нескольких стартапах. Научу вас эффективным методологиям Agile, настройке процессов и коммуникации внутри команды. Поделюсь реальными кейсами и лайфхаками, как избежать выгорания команды и успевать дедлайны без хаоса. Практические советы, которые можно применить сразу после урока.',
      images: [
        'images/skills/team-management.jpg',
        'images/skills/qa.jpg',
        'images/skills/python.jpg',
      ],
    },
  ],
};

const meta = {
  title: 'UserCard',
  component: UserCard,
  tags: ['autodocs'],
} satisfies Meta<typeof UserCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstUser: Story = {
  args: {
    user: data,
  },
};
