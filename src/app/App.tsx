import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/home';
import { LoginPage } from '../pages/login';
import { RegisterPage } from '../pages/register';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<LoginPage />} />
      <Route path="/reg" element={<RegisterPage />} />
    </Routes>
  );
};

export default App;
