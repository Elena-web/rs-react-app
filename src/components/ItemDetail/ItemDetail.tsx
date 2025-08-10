import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import s from './ItemDetail.module.scss';

import type { BreedResponse } from '../../api/catApi';
import { useGetBreedAndImageQuery } from '../../api/catApi';

interface BreedData {
  breed: BreedResponse;
  imageUrl: string | null;
}

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetBreedAndImageQuery(
    id ?? '',
    {
      skip: !id,
    }
  );

  if (!id) {
    return <div role="alert">Invalid ID</div>;
  }

  if (isLoading) return <Spinner />;

  if (isError) {
    const message =
      error &&
      typeof error === 'object' &&
      'message' in (error as Record<string, unknown>)
        ? String((error as { message?: unknown }).message)
        : 'Failed to fetch breed details.';
    return <div role="alert">Error: {message}</div>;
  }

  if (!data) return <div>Item Not Found</div>;

  const { breed, imageUrl } = data as BreedData;

  return (
    <div className={s.card}>
      <button className={s.closeButton} onClick={() => navigate(-1)}>
        &times;
      </button>
      <h3 className={s.title}>{breed.name}</h3>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={breed.name}
          className={s.image}
          loading="lazy"
        />
      ) : (
        <div className={s.noImage}>No image available</div>
      )}
      <p className={s.content}>
        {breed.description || 'Description not available.'}
      </p>
    </div>
  );
};

export default ItemDetail;
