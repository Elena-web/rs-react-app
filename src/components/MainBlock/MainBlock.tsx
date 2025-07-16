import React from 'react';
import CardList from '../CardList/CardList';
import Header from '../Header/Header';
import s from './MainBlock.module.scss';

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

interface BreedResponse {
  id: string;
  name: string;
  description?: string;
}

interface ImageResponseItem {
  id: string;
  url: string;
  breeds: BreedResponse[];
}

class MainBlock extends React.Component<unknown, MainState> {
  constructor(props: unknown) {
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
        const breedRes = await fetch(
          `https://api.thecatapi.com/v1/breeds/search?q=${encodeURIComponent(trimmed)}`,
          {
            headers: {
              'x-api-key':
                'live_HWgjjjcVbpz6zUvU4914UAN3W1P2RcEC32VWQ15aK0fjB71qqSUc7O4D5IccTj0b',
            },
          }
        );
        const breedData: BreedResponse[] = await breedRes.json();
        breedIds = breedData.map((breed) => breed.id);
      }

      const imageUrl = `https://api.thecatapi.com/v1/images/search?limit=${limit}&page=${page}${
        breedIds.length ? `&breed_ids=${breedIds.join(',')}` : ''
      }`;

      const imageRes = await fetch(imageUrl, {
        headers: {
          'x-api-key':
            'live_HWgjjjcVbpz6zUvU4914UAN3W1P2RcEC32VWQ15aK0fjB71qqSUc7O4D5IccTj0b',
        },
      });

      const imageData: ImageResponseItem[] = await imageRes.json();

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
