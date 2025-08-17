import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Outlet, useMatch, useNavigate, useLocation } from 'react-router-dom';
import useLocalStorage from '../../../hooks/useLocalStorage';
import CardList from '../CardList/CardList';
import Header from '../Header/Header';
import Pagination from '../Pagination/Pagination';
import SelectionBlock from '../SelectionBlock/SelectionBlock';
import s from './MainBlock.module.scss';

import {
  fetchBreedsByQuery,
  fetchAllBreeds,
  fetchCatImages,
  fetchTotalImageCount,
} from '../../../api/catApi';
import type { BreedResponse } from '../../../api/catApi';

import { useAppSelector, useAppDispatch } from '../../../hooks/reduxHooks';
import {
  clearSelection,
  toggleSelection,
} from '../../../features/selectionSlice';

interface CatCard {
  id: string;
  imageId: string;
  imageUrl: string;
  title: string;
  description?: string;
  detailsUrl: string;
}

const MainBlock: React.FC = () => {
  const [items, setItems] = useState<CatCard[]>([]);
  const [cache, setCache] = useState<Record<number, CatCard[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useLocalStorage<string>('searchTerm', '');
  const [totalPages, setTotalPages] = useState(1);
  const [fatalError, setFatalError] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('');
  const dispatch = useAppDispatch();
  const selectedIds = useAppSelector((state) => state.selection.selectedIds);

  const limit = 9;
  const showDetail = useMatch('/details/:id');
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageParam = searchParams.get('page');
    return Math.max(parseInt(pageParam || '1', 10), 1);
  }, [location.search]);

  const fetchData = useCallback(async (): Promise<CatCard[]> => {
    const trimmed = query.trim();
    setLoading(true);
    setError(null);

    try {
      const breedIds: string[] = [];
      const breedsMap: Map<string, BreedResponse> = new Map();

      if (trimmed) {
        const breedData = await fetchBreedsByQuery(trimmed);
        breedData.forEach((breed) => {
          breedIds.push(breed.id);
          breedsMap.set(breed.id, breed);
        });
      } else {
        const allBreeds = await fetchAllBreeds();
        allBreeds.forEach((breed) => breedsMap.set(breed.id, breed));
      }

      const [imageData, totalItemCount] = await Promise.all([
        fetchCatImages(limit, currentPage - 1, breedIds),
        fetchTotalImageCount(breedIds),
      ]);

      setTotalPages(Math.max(1, Math.ceil(totalItemCount / limit)));

      return imageData.map((item) => {
        const breed = item.breeds?.[0];
        return {
          id: item.id,
          imageId: item.id,
          imageUrl: item.url,
          title: breed?.name || 'Unknown cat',
          description: breed?.description || 'No description',
          detailsUrl: `${window.location.origin}/details/${item.id}`,
        };
      });
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to retrieve data.';
      console.error(errorMessage);
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [query, currentPage]);

  useEffect(() => {
    const cachedItems = cache[currentPage];

    if (cachedItems) {
      setItems(cachedItems);
    } else {
      fetchData().then((data) => {
        setItems(data);
        setCache((prev) => ({ ...prev, [currentPage]: data }));
      });
    }
  }, [currentPage, cache, fetchData]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setCache({});
    navigate({ pathname: '/', search: '?page=1' });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page.toString());
    navigate({ pathname: location.pathname, search: params.toString() });
  };

  const toggleSelect = (id: string) => {
    dispatch(toggleSelection(id));
  };

  const handleClearSelection = () => {
    dispatch(clearSelection());
  };

  const handleDownload = () => {
    const allCachedItems = Object.values(cache).flat();

    const selectedItems = allCachedItems.filter((item) =>
      selectedIds.includes(item.id)
    );

    const csvContent = [
      ['Title', 'Description'],
      ...selectedItems.map((item) => [item.title, item.description || '']),
    ]
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    setDownloadFilename(`${selectedItems.length}_cat_breeds.csv`);
    setDownloadUrl(url);
  };

  useEffect(() => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = downloadFilename;
      link.click();

      return () => {
        URL.revokeObjectURL(downloadUrl);
        setDownloadUrl(null);
      };
    }
  }, [downloadUrl, downloadFilename]);

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
              <CardList
                items={items}
                loading={loading}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
              />
            </div>
            <div className={s.detail}>
              <Outlet />
            </div>
          </div>
        ) : (
          <CardList
            items={items}
            loading={loading}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
          />
        )}
      </section>

      {!loading && items.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {selectedIds.length > 0 && (
        <SelectionBlock
          selectedCount={selectedIds.length}
          onClear={handleClearSelection}
          onDownload={handleDownload}
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
