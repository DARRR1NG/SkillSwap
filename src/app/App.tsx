import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { HomePage } from '../pages/home';
import { LoginPage } from '../pages/login';
import { RegisterPage } from '../pages/register';
import { FavoritesPage } from '../pages/favorites';
import { initUsers } from '../utils/initUsers';

const App = () => {
  useEffect(() => {
    initUsers();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<LoginPage />} />
      <Route path="/reg" element={<RegisterPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
    </Routes>
  );
};

export default App;
