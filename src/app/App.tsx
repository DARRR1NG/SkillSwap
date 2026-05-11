import { Footer } from '../widgets/Footer';
import { IconButton } from '../shared/ui/IconButton/IconButton';
import { useState } from 'react';
import { FilterColumn } from '../widgets/FilterColumn/FilterColumn';
import { InfoAuth } from '../widgets/InfoAuth/InfoAuth';

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
      <InfoAuth
        img={'public/images/decor/light-bulb.svg'}
        alt="dadas"
        title={'С возвращением в SkillSwap!'}
        text={'Обменивайтесь знаниями и навыками с другими людьми'}
      />
    </>
  );
}

export default App;
