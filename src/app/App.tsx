import { Footer } from '../widgets/Footer';
import { IconButton } from '../shared/ui/IconButton/IconButton';
import { useState } from 'react';

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
    </>
  );
}

export default App;
