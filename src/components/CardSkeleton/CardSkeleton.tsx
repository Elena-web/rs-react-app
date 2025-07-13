import React from 'react';
import s from './CardSkeleton.module.scss';

class CardSkeleton extends React.Component {
  render() {
    return (
      <div className={`${s.card} ${s.skeleton}`}>
        <div className={s.imageSkeleton}></div>
        <div className={s.textSkeleton}></div>
        <div className={s.textSkeleton}></div>
      </div>
    );
  }
}

export default CardSkeleton;
