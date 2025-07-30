import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

import {
  fetchBreedsByQuery,
  fetchCatImages,
  fetchBreedAndImageUrl,
  fetchTotalImageCount,
} from './catApi';

import type {
  MockImage,
  MockBreed,
} from '../components/MainBlock/__mocks__/mocks';

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('catApi functions', () => {
  describe('fetchBreedsByQuery', () => {
    it('returns breed data when query is valid', async () => {
      const mockBreeds: MockBreed[] = [{ id: 'abc', name: 'Siberian' }];
      fetchMock.mockResponseOnce(JSON.stringify(mockBreeds));

      const result = await fetchBreedsByQuery('Sib');

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('breeds/search?q=Sib'),
        expect.any(Object)
      );
      expect(result).toEqual(mockBreeds);
    });

    it('returns empty array when query is empty or whitespace', async () => {
      const result = await fetchBreedsByQuery('  ');
      expect(result).toEqual([]);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('throws error on fetch failure', async () => {
      fetchMock.mockResponseOnce('', { status: 500 });

      await expect(fetchBreedsByQuery('Sib')).rejects.toThrow(
        'Failed to fetch breeds'
      );
    });
  });

  describe('fetchCatImages', () => {
    it('fetches images with correct params', async () => {
      const mockImages: MockImage[] = [
        { id: 'img1', url: 'url1', breeds: [] },
        { id: 'img2', url: 'url2', breeds: [] },
      ];
      fetchMock.mockResponseOnce(JSON.stringify(mockImages));

      const result = await fetchCatImages(5, 1, ['abc']);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('limit=5&page=1&breed_ids=abc'),
        expect.any(Object)
      );
      expect(result).toEqual(mockImages);
    });

    it('fetches images without breedIds', async () => {
      const mockImages: MockImage[] = [];
      fetchMock.mockResponseOnce(JSON.stringify(mockImages));

      const result = await fetchCatImages(10, 0);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('limit=10&page=0'),
        expect.any(Object)
      );
      expect(result).toEqual(mockImages);
    });

    it('throws error on fetch failure', async () => {
      fetchMock.mockResponseOnce('', { status: 404 });

      await expect(fetchCatImages(5, 0)).rejects.toThrow(
        'Failed to fetch images'
      );
    });
  });

  describe('fetchBreedAndImageUrl', () => {
    it('fetches breed details and image url', async () => {
      const mockBreeds: MockBreed[] = [
        { id: 'abc', name: 'Siberian', description: 'desc' },
        { id: 'def', name: 'Persian' },
      ];
      const mockImages: MockImage[] = [
        {
          id: 'img1',
          url: 'url1',
          breeds: [mockBreeds[0]],
        },
      ];

      fetchMock.mockResponses(
        [JSON.stringify(mockBreeds), { status: 200 }],
        [JSON.stringify(mockImages), { status: 200 }]
      );

      const result = await fetchBreedAndImageUrl('abc');

      expect(fetchMock).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('/breeds'),
        expect.any(Object)
      );
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('images/search'),
        expect.any(Object)
      );

      expect(result).toEqual({ breed: mockBreeds[0], imageUrl: 'url1' });
    });

    it('throws error if breed not found', async () => {
      const mockBreeds: MockBreed[] = [{ id: 'def', name: 'Persian' }];

      fetchMock.mockResponseOnce(JSON.stringify(mockBreeds));

      await expect(fetchBreedAndImageUrl('abc')).rejects.toThrow(
        'Breed with id "abc" not found'
      );
    });

    it('throws error on breeds fetch failure', async () => {
      fetchMock.mockResponseOnce('', { status: 500 });

      await expect(fetchBreedAndImageUrl('abc')).rejects.toThrow(
        'Failed to fetch breeds list'
      );
    });
  });

  describe('fetchTotalImageCount', () => {
    it('returns correct count of images', async () => {
      const mockImageItem: MockImage = { id: 'img', url: 'url', breeds: [] };
      const mockImages: MockImage[] = new Array(50).fill(mockImageItem);

      fetchMock.mockResponseOnce(JSON.stringify(mockImages));

      const count = await fetchTotalImageCount(['abc', 'def']);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('limit=1000&page=0&breed_ids=abc,def'),
        expect.any(Object)
      );
      expect(count).toBe(50);
    });

    it('returns zero when no images', async () => {
      const mockImages: MockImage[] = [];
      fetchMock.mockResponseOnce(JSON.stringify(mockImages));

      const count = await fetchTotalImageCount([]);

      expect(count).toBe(0);
    });

    it('throws error on fetch failure', async () => {
      fetchMock.mockResponseOnce('', { status: 500 });

      await expect(fetchTotalImageCount([])).rejects.toThrow(
        'Failed to fetch image count'
      );
    });
  });
});
