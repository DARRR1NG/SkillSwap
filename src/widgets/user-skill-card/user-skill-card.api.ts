import type {
  UserSkillCardApiCategory,
  UserSkillCardApiCitiesResponse,
  UserSkillCardApiSkill,
  UserSkillCardApiSkillCanTeach,
  UserSkillCardApiUsersResponse,
  UserSkillCardData,
  UserSkillCardQuery,
} from './user-skill-card.types';

type UserSkillCardApiOptions = UserSkillCardQuery & {
  signal?: AbortSignal;
};

const getJson = async <T>(url: string, signal?: AbortSignal): Promise<T> => {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить ${url}`);
  }

  return response.json() as Promise<T>;
};

const getAgeFromBirthday = (birthday: string): number | null => {
  const birthDate = new Date(birthday);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
};

const getSkillTitleById = (skillsById: Map<number, UserSkillCardApiSkill>, id: string) =>
  skillsById.get(Number(id))?.title;

const getSkillImage = (skill: UserSkillCardApiSkillCanTeach, image: string, index: number) => ({
  id: `${skill.id}-${index}`,
  src: image,
  alt: `${skill.customTitle}, изображение ${index + 1}`,
});

export const getUserSkillCardData = async ({
  userId,
  skillId,
  signal,
}: UserSkillCardApiOptions = {}): Promise<UserSkillCardData | null> => {
  const [usersData, citiesData, skillsData, categoriesData] = await Promise.all([
    getJson<UserSkillCardApiUsersResponse>('../public/db/users.json', signal),
    getJson<UserSkillCardApiCitiesResponse>('../public/db/cities.json', signal),
    getJson<UserSkillCardApiSkill[]>('../public/db/skills.json', signal),
    getJson<UserSkillCardApiCategory[]>('../public/db/skillsCategories.json', signal),
  ]);

  const users = usersData.users ?? [];
  const user =
    userId !== undefined
      ? users.find((item) => item.id === userId)
      : (users.find((item) => item.skillsCanTeach.some((skill) => skill.id === skillId)) ??
        users[0]);

  if (!user) {
    return null;
  }

  const skill =
    skillId !== undefined
      ? user.skillsCanTeach.find((item) => item.id === skillId)
      : user.skillsCanTeach[0];

  if (!skill) {
    return null;
  }

  const citiesById = new Map(citiesData.cities.map((city) => [city.id, city]));
  const skillsById = new Map(skillsData.map((item) => [item.id, item]));
  const categoriesById = new Map(categoriesData.map((category) => [category.id, category]));

  const wantsToLearn = user.skillsWantId
    .map((id) => {
      const title = getSkillTitleById(skillsById, id);

      if (!title) {
        return null;
      }

      return {
        id,
        title,
      };
    })
    .filter((item): item is { id: string; title: string } => item !== null);

  const canTeach = user.skillsCanTeach.map((item) => ({
    id: String(item.id),
    title: item.customTitle,
  }));

  return {
    user: {
      name: user.name,
      city: citiesById.get(user.cityId)?.name ?? 'Город не указан',
      age: getAgeFromBirthday(user.birthday),
      avatar: user.userAvatar,
      description: user.about,
      canTeach,
      wantsToLearn,
    },
    skill: {
      title: skill.customTitle,
      category: categoriesById.get(skill.categoryId)?.title ?? 'Категория не указана',
      subcategory: skillsById.get(skill.subcategoryId)?.title,
      description: skill.description,
      images: skill.images.map((image, index) => getSkillImage(skill, image, index)),
    },
  };
};
