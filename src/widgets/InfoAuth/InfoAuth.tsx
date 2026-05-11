import s from './InfoAuth.module.css';

interface IInfoProps {
  img: string;
  title: string;
  text: string;
  alt: string;
}

export const InfoAuth = ({ img, title, text, alt }: IInfoProps) => {
  return (
    <>
      <div className={s.infoAuthContainer}>
        <img src={img} alt={alt} />
        <div className={s.infoAuthTextContainer}>
          <h2>{title}</h2>
          <p className={s.infoAuthPar}>{text}</p>
        </div>
      </div>
    </>
  );
};
