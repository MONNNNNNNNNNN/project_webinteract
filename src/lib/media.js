// Admin uploads can be an image or a video, and both land in the same
// `image_url` column (api/upload.js accepts MP4/WebM/MOV). Nothing else records
// which one a row holds, so the URL's extension decides the element.

const VIDEO = /\.(mp4|webm|mov)(\?|$)/i;

export function isVideoUrl(url) {
  return Boolean(url) && VIDEO.test(url);
}
