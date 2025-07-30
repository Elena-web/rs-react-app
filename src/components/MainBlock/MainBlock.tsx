import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Outlet, useMatch, useNavigate, useLocation } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';
import CardList from '../CardList/CardList';
import Header from '../Header/Header';
import Pagination from '../Pagination/Pagination';
import s from './MainBlock.module.scss';

import {
  fetchBreedsByQuery,
  fetchCatImages,
  fetchTotalImageCount,
} from '../../api/catApi';

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
  const [totalPages, setTotalPages] = useState(1);
  const [fatalError, setFatalError] = useState(false);

  const limit = 9;
  const showDetail = useMatch('/details/:id');

  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageParam = searchParams.get('page');
    return Math.max(parseInt(pageParam || '1', 10), 1);
  }, [location.search]);

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

      const [imageData, totalItemCount] = await Promise.all([
        fetchCatImages(limit, currentPage - 1, breedIds),
        fetchTotalImageCount(breedIds),
      ]);

      setTotalPages(Math.max(1, Math.ceil(totalItemCount / limit)));

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
  }, [query, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    navigate(`/?page=1`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page.toString());
    navigate({ pathname: location.pathname, search: params.toString() });
  };

  if (fatalError) {
    throw new Error('Simulated error caught by ErrorBoundary');
  }

  return (
    <main className={s.main}>
      <Header onSearch={handleSearch} defaultValue={query} />

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

      {!loading && items.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <div className={s.errorButton}>
        <button onClick={() => setFatalError(true)} className={s.throwButton}>
          Trigger error
        </button>
      </div>
    </main>
  );
};

export default MainBlock;
