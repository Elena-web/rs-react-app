import React from 'react';
import CardSkeleton from '../CardSkeleton/CardSkeleton';
import s from './CardListSkeleton.module.scss';

const CardListSkeleton: React.FC = () => {
  return (
    <div className={s.wrapper} data-testid="loader">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
};

export default CardListSkeleton;
