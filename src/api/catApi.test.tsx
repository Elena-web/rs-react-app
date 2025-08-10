import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

import type { BreedResponse, ImageResponseItem } from './catApi';
import { catApi } from './catApi';
import { configureStore } from '@reduxjs/toolkit';

const waitFor = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms));

function setupApiStore(api: typeof catApi) {
  const store = configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

  return store;
}

function getLastFetchUrl(): string {
  const lastCall = fetchMock.mock.lastCall;
  if (!lastCall) {
    throw new Error('Expected fetch to be called');
  }
  const input = lastCall[0];
  if (typeof input === 'string') return input;
  if (input instanceof Request) return input.url;
  throw new Error('Unsupported fetch input type: expected string or Request');
}

function getFetchUrlAtIndex(index: number): string {
  const call = fetchMock.mock.calls[index];
  if (!call) {
    throw new Error(`Expected fetch call at index ${index}`);
  }
  const input = call[0];
  if (typeof input === 'string') return input;
  if (input instanceof Request) return input.url;
  throw new Error(`Unsupported fetch input type at index ${index}`);
}

describe('catApi endpoints', () => {
  let store: ReturnType<typeof setupApiStore>;

  beforeEach(() => {
    fetchMock.resetMocks();
    store = setupApiStore(catApi);
  });

  describe('getBreedsByQuery', () => {
    it('returns breed data when query is valid', async () => {
      const mockBreeds: BreedResponse[] = [{ id: 'abc', name: 'Siberian' }];
      fetchMock.mockResponseOnce(JSON.stringify(mockBreeds));

      const result = await store
        .dispatch(catApi.endpoints.getBreedsByQuery.initiate('Sib'))
        .unwrap();

      await waitFor();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const url = getLastFetchUrl();
      expect(url).toContain('breeds/search?q=Sib');
      expect(result).toEqual(mockBreeds);
    });

    it('throws error on fetch failure', async () => {
      fetchMock.mockRejectOnce(new Error('Network error'));

      await expect(
        store
          .dispatch(catApi.endpoints.getBreedsByQuery.initiate('Sib'))
          .unwrap()
      ).rejects.toMatchObject({
        error: expect.stringContaining('Network error'),
      });
    });
  });

  describe('getCatImages', () => {
    it('fetches images with correct params', async () => {
      const mockImages: ImageResponseItem[] = [
        { id: 'img1', url: 'url1', breeds: [] },
        { id: 'img2', url: 'url2', breeds: [] },
      ];
      fetchMock.mockResponseOnce(JSON.stringify(mockImages));

      const result = await store
        .dispatch(
          catApi.endpoints.getCatImages.initiate({
            limit: 5,
            page: 1,
            breedIds: ['abc'],
          })
        )
        .unwrap();

      await waitFor();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const url = getLastFetchUrl();
      expect(url).toContain('limit=5');
      expect(url).toContain('page=1');
      expect(url).toContain('breed_ids=abc');
      expect(result).toEqual(mockImages);
    });

    it('fetches images without breedIds', async () => {
      const mockImages: ImageResponseItem[] = [];
      fetchMock.mockResponseOnce(JSON.stringify(mockImages));

      const result = await store
        .dispatch(
          catApi.endpoints.getCatImages.initiate({ limit: 10, page: 0 })
        )
        .unwrap();

      await waitFor();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const url = getLastFetchUrl();
      expect(url).toContain('limit=10');
      expect(url).toContain('page=0');
      expect(url).not.toContain('breed_ids');
      expect(result).toEqual(mockImages);
    });

    it('throws error on fetch failure', async () => {
      fetchMock.mockRejectOnce(new Error('Network error'));

      await expect(
        store
          .dispatch(
            catApi.endpoints.getCatImages.initiate({ limit: 5, page: 0 })
          )
          .unwrap()
      ).rejects.toMatchObject({
        error: expect.stringContaining('Network error'),
      });
    });
  });

  describe('getBreedAndImage', () => {
    it('fetches breed details and image url', async () => {
      const mockBreeds: BreedResponse[] = [
        { id: 'abc', name: 'Siberian', description: 'Fluffy cat' },
        { id: 'def', name: 'Persian' },
      ];
      const mockImages: ImageResponseItem[] = [
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

      const result = await store
        .dispatch(catApi.endpoints.getBreedAndImage.initiate('abc'))
        .unwrap();

      await waitFor();

      expect(fetchMock).toHaveBeenCalledTimes(2);

      const firstUrl = getFetchUrlAtIndex(0);
      const secondUrl = getFetchUrlAtIndex(1);

      expect(firstUrl).toContain('/breeds');
      expect(secondUrl).toContain('images/search');
      expect(secondUrl).toContain('breed_ids=abc');
      expect(result).toEqual({ breed: mockBreeds[0], imageUrl: 'url1' });
    });

    it('throws error if breed not found', async () => {
      const mockBreeds: BreedResponse[] = [{ id: 'def', name: 'Persian' }];
      fetchMock.mockResponseOnce(JSON.stringify(mockBreeds));

      await expect(
        store
          .dispatch(catApi.endpoints.getBreedAndImage.initiate('abc'))
          .unwrap()
      ).rejects.toMatchObject({
        data: 'Breed with id "abc" not found',
        status: 404,
      });
    });

    it('throws error on breeds fetch failure', async () => {
      fetchMock.mockRejectOnce(new Error('Network error'));

      await expect(
        store
          .dispatch(catApi.endpoints.getBreedAndImage.initiate('abc'))
          .unwrap()
      ).rejects.toMatchObject({
        error: expect.stringContaining('Network error'),
      });
    });
  });

  describe('getTotalImageCount', () => {
    it('returns correct count of images', async () => {
      const mockImages: ImageResponseItem[] = Array(50).fill({
        id: 'img',
        url: 'url',
        breeds: [],
      });
      fetchMock.mockResponseOnce(JSON.stringify(mockImages));

      const result = await store
        .dispatch(
          catApi.endpoints.getTotalImageCount.initiate({
            breedIds: ['abc', 'def'],
          })
        )
        .unwrap();

      await waitFor();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const url = getLastFetchUrl();
      expect(url).toContain('limit=1000');
      expect(url).toContain('page=0');
      expect(url).toContain('breed_ids=abc,def');
      expect(result).toBe(50);
    });

    it('returns zero when no images', async () => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      const result = await store
        .dispatch(
          catApi.endpoints.getTotalImageCount.initiate({ breedIds: [] })
        )
        .unwrap();

      await waitFor();

      expect(result).toBe(0);
    });

    it('throws error on fetch failure', async () => {
      fetchMock.mockRejectOnce(new Error('Network error'));

      await expect(
        store
          .dispatch(
            catApi.endpoints.getTotalImageCount.initiate({ breedIds: [] })
          )
          .unwrap()
      ).rejects.toMatchObject({
        error: expect.stringContaining('Network error'),
      });
    });
  });
});
