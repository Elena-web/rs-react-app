import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import s from './ItemDetail.module.scss';

import type { BreedResponse } from '@api/catApi';
import { fetchBreedDetail } from '@api/catApi';

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [breed, setBreed] = useState<BreedResponse | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchBreedDetail(id)
      .then(({ breed, imageUrl }) => {
        setBreed(breed);
        setImageUrl(imageUrl);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className={s.loader}>
        <div className={s.spinner}></div>
        <span>Loading...</span>
      </div>
    );

  if (error) return <div role="alert">Error: {error}</div>;
  if (!breed) return <div>Item Not Found</div>;

  return (
    <div className={s.card}>
      <button className={s.closeButton} onClick={() => navigate(-1)}>
        &times;
      </button>
      <h3 className={s.title}>{breed.name}</h3>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={breed?.name || 'Cat'}
          className={s.image}
          loading="lazy"
        />
      ) : (
        <div>No image available</div>
      )}
      <p className={s.content}>
        {breed.description || 'Description not available.'}
      </p>
    </div>
  );
};

export default ItemDetail;
