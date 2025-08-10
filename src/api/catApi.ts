import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface BreedResponse {
  id: string;
  name: string;
  description?: string;
}

export interface ImageResponseItem {
  id: string;
  url: string;
  breeds: BreedResponse[];
}

const API_KEY =
  'live_HWgjjjcVbpz6zUvU4914UAN3W1P2RcEC32VWQ15aK0fjB71qqSUc7O4D5IccTj0b';

export const catApi = createApi({
  reducerPath: 'catApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.thecatapi.com/v1/',
    prepareHeaders: (headers) => {
      headers.set('x-api-key', API_KEY);
      return headers;
    },
  }),
  tagTypes: ['Breeds', 'Images', 'BreedDetail'],
  endpoints: (builder) => ({
    getAllBreeds: builder.query<BreedResponse[], undefined>({
      query: () => 'breeds',
      providesTags: ['Breeds'],
    }),

    getBreedsByQuery: builder.query<BreedResponse[], string>({
      query: (query) => `breeds/search?q=${encodeURIComponent(query)}`,
      providesTags: ['Breeds'],
    }),

    getCatImages: builder.query<
      ImageResponseItem[],
      { limit: number; page: number; breedIds?: string[] }
    >({
      query: ({ limit, page, breedIds = [] }) => {
        const breedParam = breedIds.length
          ? `&breed_ids=${breedIds.join(',')}`
          : '';
        return `images/search?limit=${limit}&page=${page}&order=ASC${breedParam}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Images' as const, id })),
              { type: 'Images', id: 'LIST' },
            ]
          : [{ type: 'Images', id: 'LIST' }],
    }),

    getTotalImageCount: builder.query<number, { breedIds?: string[] }>({
      query: ({ breedIds = [] }) => {
        const breedParam = breedIds.length
          ? `&breed_ids=${breedIds.join(',')}`
          : '';
        return `images/search?limit=1000&page=0${breedParam}`;
      },
      transformResponse: (response: ImageResponseItem[]) =>
        Array.isArray(response) ? response.length : 0,
      providesTags: ['Images'],
    }),

    getBreedAndImage: builder.query<
      { breed: BreedResponse; imageUrl: string | null },
      string
    >({
      async queryFn(id, _queryApi, _extraOptions, fetchWithBQ) {
        const breedsResult = await fetchWithBQ('breeds');
        if (breedsResult.error) return { error: breedsResult.error };

        const breeds = breedsResult.data as BreedResponse[];
        const breed = breeds.find((b) => b.id === id);
        if (!breed) {
          return {
            error: {
              status: 404,
              data: `Breed with id "${id}" not found`,
            },
          };
        }

        const imageResult = await fetchWithBQ(
          `images/search?limit=1&page=0&order=ASC&breed_ids=${id}`
        );
        if (imageResult.error) return { error: imageResult.error };

        const images = imageResult.data as ImageResponseItem[];
        const imageUrl = images.length > 0 ? images[0].url : null;

        return { data: { breed, imageUrl } };
      },
      providesTags: (_result, _error, id) => [{ type: 'BreedDetail', id }],
    }),
  }),
});

export const {
  useGetAllBreedsQuery,
  useGetBreedsByQueryQuery,
  useGetCatImagesQuery,
  useGetTotalImageCountQuery,
  useGetBreedAndImageQuery,
} = catApi;
