import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import useLocalStorage from '@hooks/useLocalStorage';
import CardList from '../CardList/CardList';
import Header from '../Header/Header';
import s from './MainBlock.module.scss';

import { fetchBreedsByQuery, fetchCatImages } from '@api/catApi';

interface CatCard {
  id: string;
  imageUrl: string;
  title: string;
}

const MainBlock: React.FC = () => {
  const [items, setItems] = useState<CatCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useLocalStorage<string>('searchTerm', '');
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [fatalError, setFatalError] = useState(false);
  const showDetail = useMatch('/details/:id');

  const fetchData = useCallback(async () => {
    const trimmed = query.trim();

    setLoading(true);
    setError(null);

    try {
      let breedIds: string[] = [];

      if (trimmed) {
        const breedData = await fetchBreedsByQuery(trimmed);
        breedIds = breedData.map((breed) => breed.id);
      }

      const imageData = await fetchCatImages(limit, page, breedIds);

      const formatted: CatCard[] = imageData.map((item) => ({
        id: item.breeds?.[0]?.id || item.id,
        imageUrl: item.url,
        title: item.breeds?.[0]?.name || 'Funny cat',
      }));

      setItems(formatted);
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to retrieve data.';
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [query, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery.trim());
    setPage(1);
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  if (fatalError) {
    throw new Error('Simulated error caught by ErrorBoundary');
  }

  return (
    <main className={s.main}>
      <Header onSearch={handleSearch} />

      {error && (
        <div className={s.error} role="alert">
          {error}
        </div>
      )}

      <section className={s.results}>
        {showDetail ? (
          <div className={s.split}>
            <div className={s.list}>
              <CardList items={items} loading={loading} />
            </div>
            <div className={s.detail}>
              <Outlet />
            </div>
          </div>
        ) : (
          <CardList items={items} loading={loading} />
        )}
      </section>

      <div className={s.pagination}>
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className={s.pageButton}
        >
          ← Previous
        </button>
        <button
          onClick={handleNextPage}
          className={`${s.pageButton}
		${s.pageNext}`}
        >
          Next →
        </button>
      </div>

      <div className={s.errorButton}>
        <button onClick={() => setFatalError(true)} className={s.throwButton}>
          Trigger error
        </button>
      </div>
    </main>
  );
};

export default MainBlock;
