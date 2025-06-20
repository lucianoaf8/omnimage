const BASE_URL = 'http://localhost:5000/api';

export interface ImageMeta {
  id: string;
  filename: string;
  url: string;
  thumbnail_url: string;
  prompt_id: string;
  model: string;
  provider: string;
  created_at: string;
  extension: string;
  size_mb?: number;
  status?: string;
}

export interface StatsResponse {
  total_images: number;
  providers: Record<string, number>;
  models: Record<string, number>;
  prompts: Record<string, number>;
  success_rate: number;
  status: string;
}

export interface LogLine {
  time: string;
  status: string;
  message: string;
}

export const apiService = {
  getImages: async (): Promise<ImageMeta[]> => {
    const res = await fetch(`${BASE_URL}/images`);
    return res.json();
  },
  uploadImage: async (file: File): Promise<{ success: boolean; filename: string }> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${BASE_URL}/images/upload`, {
      method: 'POST',
      body: form,
    });
    return res.json();
  },
  deleteImage: async (filename: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${BASE_URL}/image/${filename}`, { method: 'DELETE' });
    return res.json();
  },
  getStats: async (): Promise<StatsResponse> => {
    const res = await fetch(`${BASE_URL}/stats`);
    return res.json();
  },
  getLogs: async (): Promise<LogLine[]> => {
    const res = await fetch(`${BASE_URL}/logs`);
    return res.json();
  },
  getProgress: async (): Promise<any> => {
    const res = await fetch(`${BASE_URL}/progress`);
    return res.json();
  },
};

export default apiService;
