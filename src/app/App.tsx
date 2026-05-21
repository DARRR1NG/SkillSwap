import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { HomePage } from '../pages/home';
import { LoginPage } from '../pages/login';
import { RegisterPage } from '../pages/register';
import { FavoritesPage } from '../pages/favorites';
import { ProfilePage } from '../pages/profile';
import { Error404 } from '../pages/errors/error-404/error404';
import { Error500 } from '../pages/errors/error-500/error500';
import { initUsers } from '../utils/initUsers';

const App = () => {
  useEffect(() => {
    initUsers();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reg" element={<RegisterPage />} />
      <Route path="/registration" element={<RegisterPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/error/500" element={<Error500 />} />
      <Route path="/error/:type" element={<Error500 />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default App;
