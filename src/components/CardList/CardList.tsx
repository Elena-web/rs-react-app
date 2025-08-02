import React from 'react';
import Card from '../Card/Card';
import CardListSkeleton from '../CardListSkeleton/CardListSkeleton';
import { useAppSelector } from '../../hooks/reduxHooks';
import s from './CardList.module.scss';

interface CardItem {
  id: string;
  imageId: string;
  title: string;
  imageUrl?: string;
}

interface CardListProps {
  items: CardItem[];
  loading?: boolean;
}

const CardList: React.FC<CardListProps> = ({ items, loading = false }) => {
  const selectedIds = useAppSelector((state) => state.selection.selectedIds);

  if (loading) {
    return <CardListSkeleton />;
  }

  return (
    <div className={s.wrapper}>
      {items.map(({ id, imageId, title, imageUrl }) => (
        <Card
          key={imageId}
          id={id}
          title={title}
          imageUrl={imageUrl}
          isSelected={selectedIds.includes(id)}
          data-testid="card"
        />
      ))}
    </div>
  );
};
export default CardList;
