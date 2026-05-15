import s from './textarea.module.css';

export const Textarea = () => {
  return (
    <>
      <div className={s.textarea_container}>
        <textarea name="about" id="" placeholder="Напиши что-нибудь о себе..." />
      </div>
    </>
  );
};
