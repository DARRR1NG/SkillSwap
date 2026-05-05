import type { FC } from 'react';
import s from './radioSelector.module.css';

type radioButtonProps = {
  text: string;
  selected: boolean;
  onClick: () => void;
};

type option = {
  text: string;
  selected: boolean;
  onClick: () => void;
};
type RadioSelectorProps = {
  options: option[];
};

const RadioButton: FC<radioButtonProps> = ({ text, selected, onClick }) => {
  return (
    <label className={s.radio_button_container}>
      <input type="radio" checked={selected} onChange={onClick} className={s.radio_button} />
      <span className={s.custom_radio}></span>
      <span className={s.text}>{text}</span>
    </label>
  );
};

export const RadioSelector: FC<RadioSelectorProps> = ({ options }) => {
  return (
    <div>
      {options.map((e) => (
        <RadioButton text={e.text} selected={e.selected} onClick={e.onClick} />
      ))}
    </div>
  );
};
