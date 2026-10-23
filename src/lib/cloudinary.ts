/** Cloudinary delivery URL: auto format/quality, capped at `width` (never upscales). */
export const cld = (src: string, width: number) =>
  src.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${width}/`)
