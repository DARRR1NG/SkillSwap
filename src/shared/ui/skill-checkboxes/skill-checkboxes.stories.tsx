import { useEffect, useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import {
  mapSkillsJsonToCategories,
  type SkillCategoriesJson,
  type SkillsJson,
} from '../../lib/skills';
import { SkillCheckboxes, type SkillCheckboxesProps } from './skill-checkboxes';

const useSkillCategories = () => {
  const [categories, setCategories] = useState<SkillCheckboxesProps['categories']>([]);

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.BASE_URL}db/skills.json`).then(
        (response) => response.json() as Promise<SkillsJson>
      ),
      fetch(`${import.meta.env.BASE_URL}db/skillsCategories.json`).then(
        (response) => response.json() as Promise<SkillCategoriesJson>
      ),
    ]).then(([skills, skillCategories]) =>
      setCategories(mapSkillsJsonToCategories(skills, skillCategories))
    );
  }, []);

  return categories;
};

const sidebarDecorator: Decorator = (Story) => (
  <div style={{ width: 284 }}>
    <Story />
  </div>
);

const meta = {
  title: 'SkillCheckboxes',
  component: SkillCheckboxes,
  tags: ['autodocs'],
  decorators: [sidebarDecorator],
  args: {
    title: 'Навыки',
    categories: [],
  },
} satisfies Meta<typeof SkillCheckboxes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const categories = useSkillCategories();
    return <SkillCheckboxes {...args} categories={categories} />;
  },
};

export const Expanded: Story = {
  args: {
    defaultExpandedIds: ['4'],
    defaultSelectedIds: ['22'],
  },
  render: (args) => {
    const categories = useSkillCategories();
    return <SkillCheckboxes {...args} categories={categories} />;
  },
};

export const WithShowAll: Story = {
  args: {
    defaultExpandedIds: ['4'],
    showAllLabel: 'Все категории',
  },
  render: (args) => {
    const categories = useSkillCategories();
    return <SkillCheckboxes {...args} categories={categories} />;
  },
};

export const Controlled: Story = {
  render: (args) => {
    const categories = useSkillCategories();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    return (
      <SkillCheckboxes
        {...args}
        categories={categories}
        selectedIds={selectedIds}
        onSelectedChange={setSelectedIds}
      />
    );
  },
};

export const WithoutTitle: Story = {
  args: {
    title: undefined,
    defaultExpandedIds: ['4'],
  },
  render: (args) => {
    const categories = useSkillCategories();
    return <SkillCheckboxes {...args} categories={categories} />;
  },
};
