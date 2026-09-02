/**
 * Base API URL Configuration
 * - In unified deployment or local development: empty string '' (uses relative proxy or same origin).
 * - In split deployment (e.g. Vercel frontend + Render backend): set VITE_API_URL in environment.
 */
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
