import React from 'react';
import Card from '../../app/components/Card/Card';
import CardListSkeleton from '../CardListSkeleton/CardListSkeleton';
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
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

const CardList: React.FC<CardListProps> = ({
  items,
  loading = false,
  selectedIds,
  onToggleSelect,
}) => {
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
          onToggleSelect={() => onToggleSelect(id)}
        />
      ))}
    </div>
  );
};

export default CardList;
