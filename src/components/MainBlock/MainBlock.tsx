import React, { useMemo, useRef } from 'react';
import { Outlet, useMatch, useNavigate, useLocation } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';
import CardList from '../CardList/CardList';
import Header from '../Header/Header';
import Pagination from '../Pagination/Pagination';
import SelectionBlock from '../SelectionBlock/SelectionBlock';
import s from './MainBlock.module.scss';

import {
  useGetAllBreedsQuery,
  useGetBreedsByQueryQuery,
  useGetCatImagesQuery,
  useGetTotalImageCountQuery,
} from '../../api/catApi';

import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { clearSelection, toggleSelection } from '../../features/selectionSlice';

interface CatCard {
  id: string;
  imageId: string;
  imageUrl: string;
  title: string;
  description?: string;
  detailsUrl: string;
}

const ITEMS_PER_PAGE = 9;

const MainBlock: React.FC = () => {
  const [query, setQuery] = useLocalStorage<string>('searchTerm', '');
  const dispatch = useAppDispatch();

  const selectedIds = useAppSelector((state) => state.selection.selectedIds);
  const selectedItemsMap = useAppSelector(
    (state) => state.selection.selectedItems
  );

  const showDetail = useMatch('/details/:id');
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = useMemo(() => {
    const pageParam = new URLSearchParams(location.search).get('page');
    return Math.max(parseInt(pageParam || '1', 10), 1);
  }, [location.search]);

  const { data: allBreeds = [] } = useGetAllBreedsQuery(undefined, {
    skip: !!query.trim(),
  });

  const { data: breedsByQuery = [] } = useGetBreedsByQueryQuery(query, {
    skip: !query.trim(),
  });

  const breedIds = useMemo(() => {
    if (query && breedsByQuery.length > 0)
      return breedsByQuery.map((b) => b.id);
    if (!query && allBreeds.length > 0) return allBreeds.map((b) => b.id);
    return [];
  }, [query, breedsByQuery, allBreeds]);

  const isImagesQuerySkipped = breedIds.length === 0;

  const {
    data: imageData = [],
    error: imagesError,
    isFetching: isImagesFetching,
  } = useGetCatImagesQuery(
    {
      limit: ITEMS_PER_PAGE,
      page: currentPage - 1,
      breedIds,
    },
    {
      skip: isImagesQuerySkipped,
    }
  );

  const { data: totalCount = 0 } = useGetTotalImageCountQuery(
    { breedIds },
    { skip: isImagesQuerySkipped }
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  const items: CatCard[] = useMemo(() => {
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
  }, [imageData]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    navigate({ pathname: '/', search: '?page=1' });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page.toString());
    navigate({ pathname: location.pathname, search: params.toString() });
  };

  const toggleSelect = (card: CatCard) => {
    dispatch(toggleSelection(card));
  };

  const handleClearSelection = () => {
    dispatch(clearSelection());
  };

  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);

  const handleDownload = () => {
    const selectedItems = Object.values(selectedItemsMap);

    if (selectedItems.length === 0) return;

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

    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = url;
      downloadLinkRef.current.download = `${selectedItems.length}_cat_breeds.csv`;
      downloadLinkRef.current.click();
      URL.revokeObjectURL(url);
    }
  };

  const isLoading = isImagesFetching || isImagesQuerySkipped;

  return (
    <main className={s.main}>
      <Header onSearch={handleSearch} defaultValue={query} />

      {imagesError && (
        <div className={s.error} role="alert">
          Error loading data
        </div>
      )}

      <section className={s.results}>
        {showDetail ? (
          <div className={s.split}>
            <div className={s.list}>
              <CardList
                items={items}
                loading={isLoading}
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
            loading={isLoading}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
          />
        )}
      </section>

      {!isLoading && items.length > 0 && (
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

      <a
        ref={downloadLinkRef}
        style={{ display: 'none' }}
        href="/"
        download=""
        aria-hidden="true"
      >
        download
      </a>
    </main>
  );
};

export default MainBlock;
