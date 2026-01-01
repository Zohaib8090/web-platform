import type { Video, Category } from './types';
import { PlaceHolderImages } from './placeholder-images';

const categories: Category[] = [
  { id: 'sci-fi', name: 'Sci-Fi' },
  { id: 'action', name: 'Action' },
  { id: 'comedy', name: 'Comedy' },
  { id: 'drama', name: 'Drama' },
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'horror', name: 'Horror' },
  { id: 'documentary', name: 'Documentary' },
];

const videos: Video[] = [
  {
    id: '1',
    title: 'Cybernetic Dawn',
    description: 'In a future ruled by AI, a small group of rebels fights for humanity\'s survival.',
    category: 'sci-fi',
    thumbnailUrl: PlaceHolderImages.find(p => p.id === 'thumb-1')?.imageUrl!,
    imageHint: PlaceHolderImages.find(p => p.id === 'thumb-1')?.imageHint!,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '2h 15m'
  },
  {
    id: '2',
    title: 'Asphalt Velocity',
    description: 'An undercover cop infiltrates the world of illegal street racing to bring down a crime syndicate.',
    category: 'action',
    thumbnailUrl: PlaceHolderImages.find(p => p.id === 'thumb-2')?.imageUrl!,
    imageHint: PlaceHolderImages.find(p => p.id === 'thumb-2')?.imageHint!,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '1h 55m'
  },
  {
    id: '3',
    title: 'The Crimson Case',
    description: 'Two mismatched detectives must solve a series of bizarre murders before the killer strikes again.',
    category: 'drama',
    thumbnailUrl: PlaceHolderImages.find(p => p.id === 'thumb-3')?.imageUrl!,
    imageHint: PlaceHolderImages.find(p => p.id === 'thumb-3')?.imageHint!,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '2h 5m'
  },
  {
    id: '4',
    title: 'Park Bench Serenade',
    description: 'A chance encounter on a park bench blossoms into a heartwarming and unexpected romance.',
    category: 'drama',
    thumbnailUrl: PlaceHolderImages.find(p => p.id === 'thumb-4')?.imageUrl!,
    imageHint: PlaceHolderImages.find(p => p.id === 'thumb-4')?.imageHint!,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '1h 30m'
  },
  {
    id: '5',
    title: 'Last Laugh',
    description: 'A struggling stand-up comedian gets one last shot at fame, but it might cost him everything.',
    category: 'comedy',
    thumbnailUrl: PlaceHolderImages.find(p => p.id === 'thumb-5')?.imageUrl!,
    imageHint: PlaceHolderImages.find(p => p.id === 'thumb-5')?.imageHint!,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    duration: '1h 45m'
  },
  {
    id: '6',
    title: 'Chronicles of Atheria',
    description: 'A young farmhand discovers she is the heir to a magical throne and must unite her kingdom against a dark lord.',
    category: 'fantasy',
    thumbnailUrl: PlaceHolderImages.find(p => p.id === 'thumb-6')?.imageUrl!,
    imageHint: PlaceHolderImages.find(p => p.id === 'thumb-6')?.imageHint!,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    duration: '2h 40m'
  },
  {
    id: '7',
    title: 'The Gavel',
    description: 'A landmark court case that challenged the very foundations of the justice system.',
    category: 'drama',
    thumbnailUrl: PlaceHolderImages.find(p => p.id === 'thumb-7')?.imageUrl!,
    imageHint: PlaceHolderImages.find(p => p.id === 'thumb-7')?.imageHint!,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    duration: '2h 10m'
  },
  {
    id: '8',
    title: 'Whispering Woods',
    description: 'A curious child stumbles into an enchanted forest where forgotten creatures of folklore dwell.',
    category: 'fantasy',
    thumbnailUrl: PlaceHolderImages.find(p => p.id === 'thumb-8')?.imageUrl!,
    imageHint: PlaceHolderImages.find(p => p.id === 'thumb-8')?.imageHint!,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: '1h 25m'
  },
  {
    id: '9',
    title: 'Ocean\'s Depths',
    description: 'Explore the vibrant and mysterious ecosystems hidden beneath the waves in this stunning documentary.',
    category: 'documentary',
    thumbnailUrl: PlaceHolderImages.find(p => p.id === 'thumb-20')?.imageUrl!,
    imageHint: PlaceHolderImages.find(p => p.id === 'thumb-20')?.imageHint!,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    duration: '45m'
  },
  {
    id: '10',
    title: 'Checkmate',
    description: 'The intense rivalry between two of the world\'s greatest chess masters culminates in a final, decisive match.',
    category: 'drama',
    thumbnailUrl: PlaceHolderImages.find(p => p.id === 'thumb-10')?.imageUrl!,
    imageHint: PlaceHolderImages.find(p => p.id === 'thumb-10')?.imageHint!,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: '1h 50m'
  },
  {
    id: '11',
    title: 'The Alchemist\'s Legacy',
    description: 'An ancient wizard must pass on his knowledge before a powerful dark force consumes the magical world.',
    category: 'fantasy',
    thumbnailUrl: PlaceHolderImages.find(p => p.id === 'thumb-11')?.imageUrl!,
    imageHint: PlaceHolderImages.find(p => p.id === 'thumb-11')?.imageHint!,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    duration: '2h 0m'
  },
  {
    id: '12',
    title: 'Project Singularity',
    description: 'A sentient android questions its existence and place in the world.',
    category: 'sci-fi',
    thumbnailUrl: PlaceHolderImages.find(p => p.id === 'thumb-12')?.imageUrl!,
    imageHint: PlaceHolderImages.find(p => p.id === 'thumb-12')?.imageHint!,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    duration: '1h 40m'
  },
  {
    id: '13',
    title: 'Shadow Protocol',
    description: 'A top-secret agent is disavowed and must go on the run to uncover a conspiracy within his own agency.',
    category: 'action',
    thumbnailUrl: PlaceHolderImages.find(p => p.id === 'thumb-13')?.imageUrl!,
    imageHint: PlaceHolderImages.find(p => p.id === 'thumb-13')?.imageHint!,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '2h 20m'
  },
  {
    id: '14',
    title: 'Cubicle Chaos',
    description: 'A series of escalating office pranks leads to hilarious and unexpected consequences.',
    category: 'comedy',
    thumbnailUrl: PlaceHolderImages.find(p => p.id === 'thumb-14')?.imageUrl!,
    imageHint: PlaceHolderImages.find(p => p.id === 'thumb-14')?.imageHint!,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '1h 35m'
  },
  {
    id: '15',
    title: 'Echoes in the Static',
    description: 'A family trapped in their home by a mysterious phenomenon must confront their past to survive.',
    category: 'horror',
    thumbnailUrl: PlaceHolderImages.find(p => p.id === 'thumb-19')?.imageUrl!,
    imageHint: PlaceHolderImages.find(p => p.id === 'thumb-19')?.imageHint!,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '1h 28m'
  },
  {
    id: '16',
    title: 'The Forgotten Empire',
    description: 'A documentary team uncovers the secrets of a long-lost civilization.',
    category: 'documentary',
    thumbnailUrl: PlaceHolderImages.find(p => p.id === 'thumb-16')?.imageUrl!,
    imageHint: PlaceHolderImages.find(p => p.id === 'thumb-16')?.imageHint!,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '55m'
  },
   {
    id: '17',
    title: 'Cosmic Odyssey',
    description: 'A lone astronaut travels to the edge of the universe, discovering wonders and horrors beyond imagination.',
    category: 'sci-fi',
    thumbnailUrl: PlaceHolderImages.find(p => p.id === 'hero-1')?.imageUrl!,
    imageHint: PlaceHolderImages.find(p => p.id === 'hero-1')?.imageHint!,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '2h 45m'
  },
];

export function getVideos() {
  return videos;
}

export function getVideoById(id: string) {
  return videos.find(video => video.id === id);
}

export function getCategories() {
  return categories;
}

export function getVideosByCategory(categoryId: string) {
  return videos.filter(video => video.category === categoryId);
}

export function getFeaturedVideo() {
    return videos.find(v => v.id === '17')!;
}
