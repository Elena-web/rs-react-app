import React from 'react';
import { Link } from 'react-router-dom';
import s from './Card.module.scss';

interface CardProps {
  id: string;
  title: string;
  imageUrl?: string | null;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  imageUrl,
  isSelected,
  onToggleSelect,
}) => {
  const validImage = imageUrl?.trim() || 'https://placekitten.com/300/200';

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onToggleSelect(id);
  };

  return (
    <div className={s.cardWrapper}>
      <Link
        to={`/details/${id}`}
        state={{ breedId: id }}
        className={s.card}
        data-testid="card"
      >
        <div className={s.checkboxWrapper}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <img
          src={validImage}
          alt={title}
          className={s.image}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://placekitten.com/300/200';
          }}
        />
        <div className={s.content}>
          <h3 className={s.title}>{title}</h3>
        </div>
      </Link>
    </div>
  );
};

export default Card;
