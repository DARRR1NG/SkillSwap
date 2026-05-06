export type SkillJsonItem = {
  id: number;
  title: string;
};

export type SkillJsonCategory = SkillJsonItem & {
  subcategories: SkillJsonItem[];
};

export type SkillsJson = {
  data: SkillJsonCategory[];
};

export type SkillCategoryOption = {
  id: string;
  label: string;
  skills?: SkillOption[];
};

export type SkillOption = {
  id: string;
  label: string;
};

export const getSkillCategoryId = (categoryId: number) => String(categoryId);

export const getSkillId = (categoryId: number, subcategoryId: number) =>
  `${categoryId}:${subcategoryId}`;

export const mapSkillsJsonToCategories = (skills: SkillsJson): SkillCategoryOption[] =>
  skills.data.map((category) => ({
    id: getSkillCategoryId(category.id),
    label: category.title,
    skills: category.subcategories.map((subcategory) => ({
      id: getSkillId(category.id, subcategory.id),
      label: subcategory.title,
    })),
  }));
