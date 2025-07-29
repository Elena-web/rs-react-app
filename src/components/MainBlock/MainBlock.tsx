import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useMatch, useNavigate, useLocation } from 'react-router-dom';

import useLocalStorage from '../../hooks/useLocalStorage';
import Header from '../Header/Header';
import CardList from '../CardList/CardList';
import Pagination from '../Pagination/Pagination';

import { fetchCatCards } from '../../api/catApi';
import s from './MainBlock.module.scss';

import type { CatCard } from '../../api/catApi';

const MainBlock: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const pageParam = searchParams.get('page');
  const currentPage = Math.max(parseInt(pageParam || '1', 10), 1);

  const showDetail = useMatch('/details/:id');

  const [query, setQuery] = useLocalStorage<string>('searchTerm', '');
  const [items, setItems] = useState<CatCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fatalError, setFatalError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { cards, totalPages } = await fetchCatCards(query, currentPage);
      setItems(cards);
      setTotalPages(totalPages);
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
    setQuery(newQuery.trim());
    navigate(`/?page=1`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(location.search);

      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', page.toString());
      }

      navigate({ pathname: location.pathname, search: params.toString() });
    }
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <div className={s.errorButton}>
        <button onClick={() => setFatalError(true)} className={s.throwButton}>
          Trigger error
        </button>
      </div>
    </main>
  );
};

export default MainBlock;
