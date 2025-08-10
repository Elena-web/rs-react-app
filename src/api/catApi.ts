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

const headers = {
  'x-api-key': API_KEY,
};

export async function fetchAllBreeds(): Promise<BreedResponse[]> {
  const response = await fetch('https://api.thecatapi.com/v1/breeds', {
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch breeds list');
  }

  return response.json();
}

export async function fetchBreedsByQuery(
  query: string
): Promise<BreedResponse[]> {
  if (!query.trim()) return [];

  const response = await fetch(
    `https://api.thecatapi.com/v1/breeds/search?q=${encodeURIComponent(query)}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch breeds');
  }

  return response.json();
}

export async function fetchCatImages(
  limit: number,
  page: number,
  breedIds: string[] = []
): Promise<ImageResponseItem[]> {
  const breedParam = breedIds.length ? `&breed_ids=${breedIds.join(',')}` : '';
  const url = `https://api.thecatapi.com/v1/images/search?limit=${limit}&page=${page}&order=ASC${breedParam}`;

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }

  return response.json();
}

export async function fetchTotalImageCount(
  breedIds: string[] = []
): Promise<number> {
  const breedParam = breedIds.length ? `&breed_ids=${breedIds.join(',')}` : '';
  const url = `https://api.thecatapi.com/v1/images/search?limit=1000&page=0${breedParam}`;

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error('Failed to fetch image count');
  }

  const data = await response.json();
  return Array.isArray(data) ? data.length : 0;
}

export async function fetchBreedAndImageUrl(
  id: string
): Promise<{ breed: BreedResponse; imageUrl: string | null }> {
  const breedsResponse = await fetch('https://api.thecatapi.com/v1/breeds', {
    headers,
  });

  if (!breedsResponse.ok) {
    throw new Error('Failed to fetch breeds list');
  }

  const breeds: BreedResponse[] = await breedsResponse.json();
  const breed = breeds.find((b) => b.id === id);

  if (!breed) {
    throw new Error(`Breed with id "${id}" not found`);
  }

  const images = await fetchCatImages(1, 0, [id]);
  const imageUrl = images.length > 0 ? images[0].url : null;

  return { breed, imageUrl };
}
