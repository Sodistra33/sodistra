/**
 * Utility functions for handling media files (images and videos)
 */

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v', '.ogg'];
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];

/**
 * Check if a URL points to a video file
 */
export const isVideoUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  const lowercaseUrl = url.toLowerCase();
  return VIDEO_EXTENSIONS.some(ext => lowercaseUrl.includes(ext));
};

/**
 * Check if a URL points to an image file
 */
export const isImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  const lowercaseUrl = url.toLowerCase();
  // If it's not a video, assume it's an image (for backward compatibility with existing URLs)
  return !isVideoUrl(url) || IMAGE_EXTENSIONS.some(ext => lowercaseUrl.includes(ext));
};

/**
 * Get the file type from a URL
 */
export const getMediaType = (url: string | null | undefined): 'video' | 'image' | null => {
  if (!url) return null;
  if (isVideoUrl(url)) return 'video';
  return 'image';
};

/**
 * Get accept attribute for file input (images and videos)
 */
export const MEDIA_ACCEPT = "image/*,video/mp4,video/webm,video/quicktime,video/x-msvideo";
