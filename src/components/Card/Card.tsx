import React from 'react';
import { Link } from 'react-router-dom';
import s from './Card.module.scss';

interface CardProps {
  id: string;
  title: string;
  imageUrl?: string | null;
}

const Card: React.FC<CardProps> = ({ id, title, imageUrl }) => {
  const validImage = imageUrl?.trim() || 'https://placekitten.com/300/200';

  return (
    <Link to={`/details/${id}`} className={s.card}>
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
  );
};

export default Card;
