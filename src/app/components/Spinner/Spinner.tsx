'use client';

import s from './Spinner.module.scss';

const Spinner = () => {
  return (
    <div className={s.loader}>
      <div className={s.spinner}></div>
      <span>Loading...</span>
    </div>
  );
};

export default Spinner;
