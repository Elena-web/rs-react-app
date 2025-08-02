export interface MockBreed {
  id: string;
  name: string;
  temperament?: string;
  origin?: string;
  description?: string;
}

export interface MockImage {
  id: string;
  url: string;
  breeds: { id: string; name: string }[];
}

export const mockImageResponse: MockImage[] = [
  {
    id: 'abys_image',
    url: 'https://cdn.example.com/abys.jpg',
    breeds: [{ id: 'abys', name: 'Abyssinian' }],
  },
];

export const mockBreedResponse: MockBreed[] = [
  {
    id: 'abys',
    name: 'Abyssinian',
    temperament: 'Active, Energetic, Independent, Intelligent, Gentle',
    origin: 'Egypt',
    description:
      'The Abyssinian is easy to care for, and a joy to have in your home. They’re affectionate cats and love both people and other animals.',
  },
];
