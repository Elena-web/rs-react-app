import s from './CardSkeleton.module.scss';

const CardSkeleton = () => (
  <div className={`${s.card} ${s.skeleton}`} data-testid="card-skeleton-item">
    <div className={s.imageSkeleton}></div>
    <div className={s.textSkeleton}></div>
    <div className={s.textSkeleton}></div>
  </div>
);

export default CardSkeleton;
