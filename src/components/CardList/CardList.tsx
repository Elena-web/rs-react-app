import React from 'react';
import Card from '../Card/Card';
import CardSkeleton from '../CardSkeleton/CardSkeleton';
import s from './CardList.module.scss';

interface CardListProps {
  items: Array<{
    title: string;
    imageUrl?: string;
  }>;
  loading?: boolean;
}

class CardList extends React.Component<CardListProps> {
  render() {
    if (this.props.loading) {
      return (
        <div className={s.wrapper}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      );
    }

    return (
      <div className={s.wrapper}>
        {this.props.items.map((item, index) => (
          <Card key={index} title={item.title} imageUrl={item.imageUrl} />
        ))}
      </div>
    );
  }
}

export default CardList;
