import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Spinner from '../Spinner/Spinner';
import s from './ItemDetail.module.scss';
import type { BreedResponse } from '../../../api/catApi';
import { fetchBreedAndImageUrl } from '../../../api/catApi';

interface BreedData {
  breed: BreedResponse;
  imageUrl: string | null;
}

const ItemDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') || '';

  const [breedData, setBreedData] = useState<BreedData | null>(null);
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

    fetchBreedAndImageUrl(id)
      .then(({ breed, imageUrl }) => setBreedData({ breed, imageUrl }))
      .catch((err) => setError(err.message || 'Failed to fetch breed details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <div role="alert">Error: {error}</div>;
  if (!breedData) return <div>Item Not Found</div>;

  const { breed, imageUrl } = breedData;

  return (
    <div className={s.card}>
      <button className={s.closeButton} onClick={() => router.back()}>
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

export default function ItemDetailWrapper() {
  return (
    <Suspense fallback={<div>Loading Item Detail...</div>}>
      <ItemDetail />
    </Suspense>
  );
}
