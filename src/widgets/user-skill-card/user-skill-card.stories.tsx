import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserSkillCard, type UserSkillCardProps } from './user-skill-card';
import { UserSkillCardContainer } from './user-skill-card.container';

const defaultArgs: UserSkillCardProps = {
  user: {
    name: 'Иван',
    city: 'Санкт-Петербург',
    age: 34,
    avatar: 'images/avatars/ivan.jpg',
    description: 'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое',
    canTeach: [{ id: 'english', title: 'Английский язык' }],
    wantsToLearn: [
      { id: 'time-management', title: 'Тайм менеджмент' },
      { id: 'meditation', title: 'Медитация' },
    ],
  },
  skill: {
    title: 'Игра на барабанах',
    category: 'Творчество и искусство',
    subcategory: 'Музыка и звук',
    description:
      'Привет! Я играю на барабанах уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без партитуры.',
    images: [
      {
        id: 'drums-main',
        src: 'images/skills/drums.jpg',
        alt: 'Игра на барабанах',
      },
      {
        id: 'drums-lesson',
        src: 'images/skills/drums1.jpg',
        alt: 'Занятие по барабанам',
      },
      {
        id: 'drums-kit',
        src: 'images/skills/drums2.jpg',
        alt: 'Барабанная установка',
      },
    ],
  },
};

const meta = {
  title: 'Widgets/UserSkillCard',
  component: UserSkillCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '100vh',
          overflowX: 'auto',
          padding: 24,
          backgroundColor: 'var(--background)',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: defaultArgs,
} satisfies Meta<typeof UserSkillCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithManyImages: Story = {
  args: {
    ...defaultArgs,
    skill: {
      ...defaultArgs.skill,
      images: [
        ...defaultArgs.skill.images,
        {
          id: 'music',
          src: 'images/skills/guitar.jpg',
          alt: 'Музыкальное занятие',
        },
        {
          id: 'stage',
          src: 'images/skills/hiphop.jpg',
          alt: 'Ритм и выступление',
        },
        {
          id: 'sound',
          src: 'images/skills/guitar2.jpg',
          alt: 'Музыка и звук',
        },
      ],
    },
  },
};

export const WithoutImages: Story = {
  args: {
    ...defaultArgs,
    skill: {
      ...defaultArgs.skill,
      images: [],
    },
  },
};

export const LoadedFromJson: Story = {
  render: () => <UserSkillCardContainer userId={1} skillId={101} />,
};

export const EmptyFromJson: Story = {
  render: () => <UserSkillCardContainer userId={9999} />,
};
