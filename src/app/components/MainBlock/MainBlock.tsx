'use client';

import { Suspense } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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

interface MainBlockProps {
  initialPage: number;
}

const MainBlock: React.FC<MainBlockProps> = ({ initialPage }) => {
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

  const router = useRouter();
  const pathname = usePathname();

  const limit = 9;
  const currentPage = initialPage;

  const fetchData = useCallback(async (): Promise<CatCard[]> => {
    setLoading(true);
    setError(null);

    try {
      const trimmedQuery = query.trim();
      const breedIds: string[] = [];
      const breedsMap: Map<string, BreedResponse> = new Map();

      const breeds = trimmedQuery
        ? await fetchBreedsByQuery(trimmedQuery)
        : await fetchAllBreeds();

      breeds.forEach((breed) => {
        breedIds.push(breed.id);
        breedsMap.set(breed.id, breed);
      });

      const [images, totalCount] = await Promise.all([
        fetchCatImages(limit, currentPage - 1, breedIds),
        fetchTotalImageCount(breedIds),
      ]);

      setTotalPages(Math.max(1, Math.ceil(totalCount / limit)));

      return images.map((img) => {
        const breed = breedsMap.get(breedIds[0]);
        return {
          id: img.id,
          imageId: img.id,
          imageUrl: img.url,
          title: breed?.name || 'Cat',
          description: breed?.description || 'No description',
          detailsUrl: `/details/${img.id}`,
        };
      });
    } catch (err) {
      const message = (err as Error).message || 'Failed to fetch data';
      console.error(message);
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [query, currentPage]);

  useEffect(() => {
    const cached = cache[currentPage];
    if (cached) {
      setItems(cached);
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
    router.push(`/?page=1`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleSelect = (id: string) => dispatch(toggleSelection(id));
  const handleClearSelection = () => dispatch(clearSelection());

  const handleDownload = () => {
    const allItems = Object.values(cache).flat();
    const selectedItems = allItems.filter((item) =>
      selectedIds.includes(item.id)
    );

    const csv = [
      ['Title', 'Description'],
      ...selectedItems.map((i) => [i.title, i.description || '']),
    ]
      .map((row) => row.map((f) => `"${f.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    setDownloadFilename(`${selectedItems.length}_cat_breeds.csv`);
    setDownloadUrl(url);
  };

  useEffect(() => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = downloadFilename;
    link.click();
    URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  }, [downloadUrl, downloadFilename]);

  if (fatalError) throw new Error('Simulated error caught by ErrorBoundary');

  return (
    <Suspense>
      <main className={s.main}>
        <Header onSearch={handleSearch} defaultValue={query} />

        {error && (
          <div className={s.error} role="alert">
            {error}
          </div>
        )}

        <section className={s.results}>
          <CardList
            items={items}
            loading={loading}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
          />
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
    </Suspense>
  );
};

export default MainBlock;
