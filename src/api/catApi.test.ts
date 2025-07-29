import { fetchCatCards, fetchBreedsByQuery, fetchCatImages } from './catApi';
import * as api from './catApi';

jest.mock('./catApi', () => {
  const original = jest.requireActual('./catApi');
  return {
    ...original,
    fetchBreedsByQuery: jest.fn(),
    fetchCatImages: jest.fn(),
  };
});

describe('fetchCatCards', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetchBreedsByQuery calls fetch and returns data', async () => {
    const mockData = [{ id: 'beng', name: 'Bengal' }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
    });

    const result = await fetchBreedsByQuery('bengal');

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('bengal'));
    expect(result).toEqual(mockData);
  });

  it('fetchCatImages calls fetch and returns data', async () => {
    const mockImages = [
      { id: 'img1', url: 'https://example.com/cat.jpg', breeds: [] },
    ];
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockImages,
    });

    const result = await fetchCatImages(1, 0, []);

    expect(fetch).toHaveBeenCalled();
    expect(result).toEqual(mockImages);
  });

  it('fetches default cards when query is empty', async () => {
    (api.fetchCatImages as jest.Mock).mockResolvedValue([
      {
        id: 'img1',
        url: 'https://example.com/cat1.jpg',
        breeds: [],
      },
    ]);

    const { cards, totalPages } = await fetchCatCards('', 1);

    expect(api.fetchCatImages).toHaveBeenCalled();
    expect(cards).toHaveLength(1);
    expect(cards[0].title).toBe('Funny cat');
    expect(totalPages).toBeGreaterThanOrEqual(1);
  });

  it('fetches breed-specific cards when query is given', async () => {
    (api.fetchBreedsByQuery as jest.Mock).mockResolvedValue([
      { id: 'beng', name: 'Bengal' },
    ]);

    (api.fetchCatImages as jest.Mock).mockResolvedValue([
      {
        id: 'img2',
        url: 'https://example.com/cat2.jpg',
        breeds: [{ id: 'beng', name: 'Bengal' }],
      },
    ]);

    const { cards, totalPages } = await fetchCatCards('bengal', 1);

    expect(api.fetchBreedsByQuery).toHaveBeenCalledWith('bengal');
    expect(api.fetchCatImages).toHaveBeenCalledWith(expect.any(Number), 0, [
      'beng',
    ]);
    expect(cards[0].title).toBe('Bengal');
    expect(cards[0].imageUrl).toBe('https://example.com/cat2.jpg');
    expect(totalPages).toBeGreaterThanOrEqual(1);
  });
});
