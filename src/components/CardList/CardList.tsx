import React from 'react';
import Card from '../Card/Card';
import CardListSkeleton from '../CardListSkeleton/CardListSkeleton';
import s from './CardList.module.scss';

interface CardListProps {
  items: Array<{
    id: string;
    title: string;
    imageUrl?: string;
  }>;
  loading?: boolean;
}

const CardList: React.FC<CardListProps> = ({ items, loading }) => {
  if (loading) {
    return <CardListSkeleton />;
  }

  return (
    <div className={s.wrapper}>
      {items.map((item) => (
        <Card
          key={`${item.id}-${item.imageUrl}`}
          id={item.id}
          title={item.title}
          imageUrl={item.imageUrl}
        />
      ))}
    </div>
  );
};

export default CardList;
