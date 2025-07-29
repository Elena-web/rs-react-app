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

export interface CatCard {
  id: string;
  imageUrl: string;
  title: string;
}

const API_KEY =
  'live_HWgjjjcVbpz6zUvU4914UAN3W1P2RcEC32VWQ15aK0fjB71qqSUc7O4D5IccTj0b';

const headers = {
  'x-api-key': API_KEY,
};

const API_BASE = 'https://api.thecatapi.com/v1';

const limit = 9;

export async function fetchBreedsByQuery(
  query: string
): Promise<BreedResponse[]> {
  if (!query.trim()) return [];

  const response = await fetch(
    `${API_BASE}/breeds/search?q=${encodeURIComponent(query)}`,
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
  const response = await fetch(
    `${API_BASE}/images/search?limit=${limit}&page=${page}&order=DESC${breedParam}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }

  return response.json();
}

export async function fetchBreedDetail(
  id: string
): Promise<{ breed: BreedResponse; imageUrl: string | null }> {
  const response = await fetch(`${API_BASE}/breeds`, { headers });

  if (!response.ok) {
    throw new Error('Failed to fetch breeds list');
  }

  const breeds: BreedResponse[] = await response.json();
  const breed = breeds.find((b) => b.id === id);

  if (!breed) {
    throw new Error(`Breed with id "${id}" not found`);
  }

  const images = await fetchCatImages(1, 0, [id]);
  const imageUrl = images.length > 0 ? images[0].url : null;

  return { breed, imageUrl };
}

export async function fetchCatCards(
  query: string,
  page: number
): Promise<{ cards: CatCard[]; totalPages: number }> {
  const trimmed = query.trim();
  let breedIds: string[] = [];
  let totalItemsEstimate = 500;

  if (trimmed) {
    const breedData = await fetchBreedsByQuery(trimmed);
    breedIds = breedData.map((breed) => breed.id);
    totalItemsEstimate = breedIds.length * 50;

    if (breedIds.length === 0) {
      totalItemsEstimate = 0;
    }
  }

  const images = await fetchCatImages(limit, page - 1, breedIds);

  const cards: CatCard[] = images.map((item) => ({
    id: item.breeds?.[0]?.id || item.id,
    imageUrl: item.url,
    title: item.breeds?.[0]?.name || 'Funny cat',
  }));

  const totalPages =
    totalItemsEstimate > 0
      ? Math.max(1, Math.ceil(totalItemsEstimate / limit))
      : 1;

  return { cards, totalPages };
}
