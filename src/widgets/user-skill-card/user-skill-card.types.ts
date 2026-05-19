export type SkillTag = {
  id: string;
  title: string;
};

export type SkillImage = {
  id: string;
  src: string;
  alt: string;
};

export type UserSkillCardUser = {
  name: string;
  city: string;
  age: number | null;
  avatar: string;
  description: string;
  canTeach: SkillTag[];
  wantsToLearn: SkillTag[];
};

export type UserSkillCardSkill = {
  title: string;
  category: string;
  subcategory?: string;
  description: string;
  images: SkillImage[];
};

export type UserSkillCardData = {
  user: UserSkillCardUser;
  skill: UserSkillCardSkill;
};

export type UserSkillCardQuery = {
  userId?: number;
  skillId?: number;
};

export type UserSkillCardLoadState =
  | {
      status: 'loading';
      data: null;
      error: null;
    }
  | {
      status: 'error';
      data: null;
      error: string;
    }
  | {
      status: 'empty';
      data: null;
      error: null;
    }
  | {
      status: 'success';
      data: UserSkillCardData;
      error: null;
    };

export type UserSkillCardApiUser = {
  id: number;
  name: string;
  userAvatar: string;
  cityId: number;
  birthday: string;
  about: string;
  skillsWantId: string[];
  skillsCanTeach: UserSkillCardApiSkillCanTeach[];
};

export type UserSkillCardApiSkillCanTeach = {
  id: number;
  categoryId: number;
  subcategoryId: number;
  customTitle: string;
  description: string;
  images: string[];
};

export type UserSkillCardApiUsersResponse = {
  users?: UserSkillCardApiUser[];
};

export type UserSkillCardApiCity = {
  id: number;
  name: string;
};

export type UserSkillCardApiCitiesResponse = {
  cities: UserSkillCardApiCity[];
};

export type UserSkillCardApiSkill = {
  id: number;
  title: string;
  categoryId: number;
};

export type UserSkillCardApiCategory = {
  id: number;
  title: string;
};
