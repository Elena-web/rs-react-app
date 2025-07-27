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
  const response = await fetch(
    `https://api.thecatapi.com/v1/images/search?limit=${limit}&page=${page}${breedParam}`,
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
  const breedResponse = await fetch(
    `https://api.thecatapi.com/v1/breeds/${id}`,
    { headers }
  );

  if (!breedResponse.ok) {
    throw new Error(`Breed with id "${id}" not found`);
  }

  const breed: BreedResponse = await breedResponse.json();

  const images = await fetchCatImages(1, 0, [id]);
  const imageUrl = images.length > 0 ? images[0].url : null;

  return { breed, imageUrl };
}
