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

const API_KEY = process.env.CAT_API_KEY || '';

const headers = {
  'x-api-key': API_KEY,
};

export async function fetchAllBreeds(): Promise<BreedResponse[]> {
  const res = await fetch('https://api.thecatapi.com/v1/breeds', {
    headers,
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error('Failed to fetch breeds list');
  return res.json();
}

export async function fetchBreedsByQuery(
  query: string
): Promise<BreedResponse[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `https://api.thecatapi.com/v1/breeds/search?q=${encodeURIComponent(query)}`,
    { headers, next: { revalidate: 60 } }
  );

  if (!res.ok) throw new Error('Failed to fetch breeds');
  return res.json();
}

export async function fetchCatImages(
  limit: number,
  page: number,
  breedIds: string[] = []
): Promise<ImageResponseItem[]> {
  const breedParam = breedIds.length ? `&breed_ids=${breedIds.join(',')}` : '';
  const url = `https://api.thecatapi.com/v1/images/search?limit=${limit}&page=${page}&order=ASC${breedParam}`;

  const res = await fetch(url, { headers, next: { revalidate: 60 } });

  if (!res.ok) throw new Error('Failed to fetch images');
  return res.json();
}

export async function fetchTotalImageCount(
  breedIds: string[] = []
): Promise<number> {
  const breedParam = breedIds.length ? `&breed_ids=${breedIds.join(',')}` : '';
  const url = `https://api.thecatapi.com/v1/images/search?limit=1&page=0${breedParam}`;
  const res = await fetch(url, { headers });

  if (!res.ok) throw new Error('Failed to fetch image count');

  const total = res.headers.get('x-total-count');
  if (total) return parseInt(total, 10);

  return 1;
}

export async function fetchBreedAndImageUrl(id: string) {
  const breeds = await fetchAllBreeds();
  const breed = breeds.find((b) => b.id === id);
  if (!breed) throw new Error(`Breed with id "${id}" not found`);

  const images = await fetchCatImages(1, 0, [id]);
  const imageUrl = images[0]?.url || null;

  return { breed, imageUrl };
}
