import CardSkeleton from '../CardSkeleton/CardSkeleton';
import s from './CardListSkeleton.module.scss';

const CardListSkeleton = () => {
  return (
    <div className={s.wrapper} data-testid="card-skeleton">
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
