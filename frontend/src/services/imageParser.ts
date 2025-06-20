/**
 * Parse generated image filename to extract metadata.
 * Handles formats like: circuit_orb_dalle3_20250619_172354.png
 */

export interface ParsedFilename {
  promptId: string;
  model: string;
  provider: string;
  createdAt: string;
  extension: string;
  filename: string;
  timestamp: string;
}

export const parseFilename = (filename: string): ParsedFilename => {
  const stem = filename.replace(/\.[^/.]+$/, '');
  const extension = filename.split('.').pop() || '';

  const parts = stem.split('_');

  // Locate timestamp (YYYYMMDD HHMMSS)
  let tsIdx = -1;
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].length === 8 && /^\d{8}$/.test(parts[i])) {
      if (i + 1 < parts.length && /^\d{6}$/.test(parts[i + 1])) {
        tsIdx = i;
        break;
      }
    }
  }

  let promptId: string;
  let model: string;
  let timestamp: string | undefined;
  let createdAt: string;

  if (tsIdx > 0) {
    const promptParts = parts.slice(0, tsIdx - 1);
    model = parts[tsIdx - 1];
    const tsParts = parts.slice(tsIdx, tsIdx + 2);
    timestamp = tsParts.join('_');

    promptId = promptParts.length ? promptParts.join('_') : 'unknown';
    try {
      const dateStr = timestamp.replace('_', 'T');
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const hour = dateStr.substring(9, 11);
      const minute = dateStr.substring(11, 13);
      const second = dateStr.substring(13, 15);
      const d = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
      createdAt = d.toLocaleString();
    } catch {
      createdAt = timestamp;
    }
  } else {
    promptId = parts[0] || 'unknown';
    model = parts[1] || 'unknown';
    createdAt = 'unknown';
  }

  const provider = determineProvider(model);

  return {
    promptId,
    model,
    provider,
    createdAt,
    extension,
    filename,
    timestamp: timestamp || 'unknown',
  };
};

export const determineProvider = (model: string): string => {
  const m = model.toLowerCase();
  if (m.includes('dalle')) return 'openai';
  if (m.includes('flux')) return m.includes('dev') || m.includes('schnell') || m.includes('lora') ? 'together_ai' : 'fal_ai';
  if (m.includes('galleri5') || m.includes('ideogram') || m.includes('recraft')) return 'replicate';
  return 'unknown';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 MB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const generateImageId = (filename: string): string => filename.replace(/\.[^/.]+$/, '');
