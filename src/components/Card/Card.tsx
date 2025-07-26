import React from 'react';
import s from './Card.module.scss';

interface CardProps {
  title: string;
  imageUrl?: string | null;
}

class Card extends React.Component<CardProps> {
  render() {
    const { title, imageUrl } = this.props;
    const validImage = imageUrl?.trim() || 'https://placekitten.com/300/200';

    return (
      <div className={s.card}>
        <img src={validImage} alt={title} className={s.image} loading="lazy" />
        <div className={s.content}>
          <h3 className={s.title}>{title}</h3>
        </div>
      </div>
    );
  }
}

export default Card;
