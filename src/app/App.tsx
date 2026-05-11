import { Footer } from '../widgets/Footer';
import { IconButton } from '../shared/ui/IconButton/IconButton';
import { useState } from 'react';
import { FilterColumn } from '../widgets/FilterColumn/FilterColumn';
import { Header } from '../widgets/Header';

function App() {
  const handleLoginClick = () => {
    console.log('Login clicked');
  };

  const handleRegisterClick = () => {
    console.log('Register clicked');
  };
  const [isActive, setActive] = useState(false);
  const handleLike = () => {
    setActive(!isActive);
  };
  return (
    <>
      <Header
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />
      <IconButton
        onClick={handleLike}
        src={isActive ? '../public/icons/like-icon.svg' : '../public/icons/like-fill.svg'}
      />
      <Footer />
      <FilterColumn />
    </>
  );
}

export default App;