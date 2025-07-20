import React from 'react';
import CardList from '../CardList/CardList';
import Header from '../Header/Header';
import s from './MainBlock.module.scss';

import { fetchBreedsByQuery, fetchCatImages } from '../../api/catApi';

interface CatCard {
  id: string;
  imageUrl: string;
  title: string;
}

interface MainState {
  items: CatCard[];
  loading: boolean;
  error: string | null;
  query: string;
  page: number;
  limit: number;
  fatalError: boolean;
}

class MainBlock extends React.Component<{}, MainState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      items: [],
      loading: false,
      error: null,
      query: localStorage.getItem('searchTerm') || '',
      page: 1,
      limit: 10,
      fatalError: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const { query, page, limit } = this.state;
    const trimmed = query.trim();
    localStorage.setItem('searchTerm', trimmed);

    this.setState({ loading: true, error: null });

    try {
      let breedIds: string[] = [];

      if (trimmed) {
        const breedData = await fetchBreedsByQuery(trimmed);
        breedIds = breedData.map((breed) => breed.id);
      }

      const imageData = await fetchCatImages(limit, page, breedIds);

      const formatted: CatCard[] = imageData.map((item) => ({
        id: item.id,
        imageUrl: item.url,
        title: item.breeds?.[0]?.name || 'Funny cat',
      }));

      this.setState({ items: formatted });
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to retrieve data.';
      console.error(errorMessage);
      this.setState({ error: errorMessage });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSearch = (newQuery: string) => {
    this.setState({ query: newQuery.trim(), page: 1 }, this.fetchData);
  };

  handleNextPage = () => {
    this.setState((prev) => ({ page: prev.page + 1 }), this.fetchData);
  };

  handlePrevPage = () => {
    this.setState(
      (prev) => ({ page: Math.max(prev.page - 1, 1) }),
      this.fetchData
    );
  };

  render() {
    const { items, loading, error, page } = this.state;
    if (this.state.fatalError) {
      throw new Error('Simulated error caught by ErrorBoundary');
    }
    return (
      <main className={s.main}>
        <Header onSearch={this.handleSearch} />

        {loading && <div className={s.loading}>Loading...</div>}
        {error && <div className={s.error}>{error}</div>}

        <section className={s.results}>
          <CardList items={items} loading={loading} />
        </section>

        <div className={s.pagination}>
          <button
            onClick={this.handlePrevPage}
            disabled={page === 1}
            className={s.pageButton}
          >
            ← Previous
          </button>
          <button
            onClick={this.handleNextPage}
            className={`${s.pageButton} ${s.pageNext}`}
          >
            Next →
          </button>
        </div>

        <div className={s.errorButton}>
          <button
            onClick={() => {
              this.setState({ fatalError: true });
            }}
            className={s.throwButton}
          >
            Trigger error
          </button>
        </div>
      </main>
    );
  }
}

export default MainBlock;
