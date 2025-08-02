import React from 'react';
import s from './CardSkeleton.module.scss';

const CardSkeleton: React.FC = () => {
  return (
    <div className={`${s.card} ${s.skeleton}`}>
      <div className={s.imageSkeleton}></div>
      <div className={s.textSkeleton}></div>
      <div className={s.textSkeleton}></div>
    </div>
  );
};

export default CardSkeleton;
