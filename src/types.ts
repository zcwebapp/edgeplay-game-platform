/**
 * EdgePlay Game Platform - TypeScript Types & Bindings
 */

export interface Env {
  DB: D1Database;
  GAME_ASSETS: R2Bucket;
  ASSETS: Fetcher;
  ENVIRONMENT?: string;
}

export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags?: string; // JSON string array
  developer: string;
  source_type: string;
  entry_url: string;
  thumbnail_url: string;
  orientation: string;
  play_count: number;
  rating_avg: number;
  rating_count: number;
  status: string;
  is_featured: number;
  created_at: string;
}

export interface LeaderboardEntry {
  id: number;
  game_id: string;
  user_id: string;
  username?: string;
  avatar_url?: string;
  score: number;
  score_display: string;
  rank?: number;
  created_at: string;
}

export interface GameSave {
  id?: number;
  user_id: string;
  game_id: string;
  slot_id: number;
  r2_key: string;
  file_size: number;
  summary: string;
  updated_at?: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar_url?: string;
  role: string;
  is_vip: number;
}
