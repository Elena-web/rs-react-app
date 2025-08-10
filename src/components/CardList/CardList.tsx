import React from 'react';
import Card from '../Card/Card';
import CardListSkeleton from '../CardListSkeleton/CardListSkeleton';
import s from './CardList.module.scss';

interface CardItem {
  id: string;
  imageId: string;
  imageUrl: string;
  title: string;
  description?: string;
  detailsUrl: string;
}

interface CardListProps {
  items: CardItem[];
  loading?: boolean;
  selectedIds: string[];
  onToggleSelect: (card: CardItem) => void;
}

const CardList: React.FC<CardListProps> = ({
  items,
  loading = false,
  selectedIds,
  onToggleSelect,
}) => {
  if (loading) return <CardListSkeleton />;

  return (
    <div className={s.wrapper}>
      {items.map((item) => (
        <Card
          key={item.imageId}
          id={item.id}
          title={item.title}
          imageUrl={item.imageUrl}
          isSelected={selectedIds.includes(item.id)}
          onToggleSelect={() => onToggleSelect(item)}
        />
      ))}
    </div>
  );
};
export default CardList;
