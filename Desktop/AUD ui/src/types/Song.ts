export interface Song {
  id: string;
  title: string;
  genre: string;
  subGenres?: string[];
  duration: number;
  audioUrl: string;
  imageUrl?: string;
  prompt: string;
  timestamp: number;
}
