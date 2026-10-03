const USERS_STORAGE_KEY = 'users';

const ud = await fetch(`${import.meta.env.BASE_URL}db/users.json`);
const usersData = await ud.json();

export const initUsers = () => {
  const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);

  if (!existingUsers) {
    // Берём пользователей из users.json
    const users = usersData.users.map((user: any) => ({
      id: String(user.id),
      name: user.name,
      email: user.email,
      password: user.password,
      avatar: user.userAvatar,
      cityId: user.cityId,
      gender: user.gender,
      birthday: user.birthday,
      createdAt: user.createdAt,
      about: user.about,
      likes: user.likes,
      skillsWantId: user.skillsWantId,
      skillsCanTeach: user.skillsCanTeach,
    }));

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    console.log('✅ Пользователи добавлены в localStorage:', users.length);
  }
};
