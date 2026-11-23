const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://chamunda-enterprise-gamma.vercel.app/api';
const BACKEND_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export default function resolveImageUrl(src) {
  if (!src) return '';

  try {
    const url = new URL(src, BACKEND_ORIGIN);
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      return `${BACKEND_ORIGIN}${url.pathname}${url.search}${url.hash}`;
    }
    return src;
  } catch {
    return src;
  }
}
