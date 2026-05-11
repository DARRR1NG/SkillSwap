import { Footer } from '../widgets/Footer';
import { IconButton } from '../shared/ui/IconButton/IconButton';
import { useState } from 'react';
import { FilterColumn } from '../widgets/FilterColumn/FilterColumn';

function App() {
  const [isActive, setActive] = useState(false);
  const handleLike = () => {
    setActive(!isActive);
  };
  return (
    <>
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
