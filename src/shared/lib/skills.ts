export type SkillJsonItem = {
  id: number;
  title: string;
};

export type SkillJsonFlatItem = SkillJsonItem & {
  categoryId: number;
};

export type SkillJsonCategory = SkillJsonItem & {
  subcategories: SkillJsonItem[];
};

export type NestedSkillsJson = {
  data: SkillJsonCategory[];
};

export type SkillsJson = SkillJsonFlatItem[] | NestedSkillsJson;

export type SkillCategoriesJson = SkillJsonItem[];

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

export const getSkillId = (skillId: number) => String(skillId);

const mapNestedSkillsJsonToCategories = (skills: NestedSkillsJson): SkillCategoryOption[] =>
  skills.data.map((category) => ({
    id: getSkillCategoryId(category.id),
    label: category.title,
    skills: category.subcategories.map((subcategory) => ({
      id: getSkillId(subcategory.id),
      label: subcategory.title,
    })),
  }));

const mapFlatSkillsJsonToCategories = (
  skills: SkillJsonFlatItem[],
  categories: SkillCategoriesJson = []
): SkillCategoryOption[] => {
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const groupedSkills = new Map<number, SkillJsonFlatItem[]>();

  skills.forEach((skill) => {
    const categorySkills = groupedSkills.get(skill.categoryId) ?? [];
    groupedSkills.set(skill.categoryId, [...categorySkills, skill]);
  });

  return Array.from(groupedSkills, ([categoryId, categorySkills]) => ({
    id: getSkillCategoryId(categoryId),
    label: categoryById.get(categoryId)?.title ?? `Категория ${categoryId}`,
    skills: categorySkills.map((skill) => ({
      id: getSkillId(skill.id),
      label: skill.title,
    })),
  }));
};

export const mapSkillsJsonToCategories = (
  skills: SkillsJson,
  categories?: SkillCategoriesJson
): SkillCategoryOption[] => {
  if (Array.isArray(skills)) {
    return mapFlatSkillsJsonToCategories(skills, categories);
  }

  return mapNestedSkillsJsonToCategories(skills);
};
