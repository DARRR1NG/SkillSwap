export type TSkillCanTeach = {
  id: number;
  categoryId: number;
  subcategoryId: number;
  customTitle: string;
  description: string;
  images: string[];
};

export type TSkillWant = {
  id: number;
  title: string;
  categoryId: number;
};

export type TUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  userAvatar: string;
  cityId: number;
  gender: string;
  birthday: string;
  createdAt: string;
  about: string;
  skillsWantId: string[];
  likes: number;
  skillsCanTeach: TSkillCanTeach[];
};

export type City = {
  id: number;
  name: string;
};
