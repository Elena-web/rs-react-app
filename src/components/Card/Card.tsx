import React from 'react';
import { useNavigate } from 'react-router-dom';
import s from './Card.module.scss';

interface CardProps {
  id: string;
  title: string;
  imageUrl?: string | null;
}

const Card: React.FC<CardProps> = ({ id, title, imageUrl }) => {
  const navigate = useNavigate();
  const validImage = imageUrl?.trim() || 'https://placekitten.com/300/200';

  const handleClick = () => {
    navigate(`/details/${id}`);
  };

  return (
    <div className={s.card} onClick={handleClick}>
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
    </div>
  );
};

export default Card;
