/**
 * Con Force Marketplace URL & Deep Link Utility
 * Production Domain: https://venezuela-iota.vercel.app/
 */

export const VERCEL_PRODUCTION_URL = 'https://venezuela-iota.vercel.app';

/**
 * Gets the base URL for generating deep links.
 * Prefers the official production Vercel domain so links shared across
 * WhatsApp, chats, SMS or bookmarks always resolve cleanly.
 */
export function getMarketplaceBaseUrl(forceProduction: boolean = false): string {
  if (!forceProduction && typeof window !== 'undefined' && window.location?.origin) {
    const origin = window.location.origin;
    // If running in development or preview, or if on vercel
    if (origin.includes('vercel.app')) {
      return origin;
    }
  }
  return VERCEL_PRODUCTION_URL;
}

export interface DeepLinkOptions {
  businessId?: string;
  productId?: string;
  category?: string;
  filter?: string;
  search?: string;
  forceProduction?: boolean;
}

/**
 * Builds a direct, non-broken deep link to the Con Force Marketplace
 */
export function buildDeepLink(options: DeepLinkOptions = {}): string {
  const baseUrl = getMarketplaceBaseUrl(options.forceProduction ?? true);
  const params = new URLSearchParams();

  if (options.businessId) {
    params.set('view', 'business');
    params.set('id', options.businessId);
    if (options.productId) {
      params.set('product', options.productId);
    }
  } else if (options.category) {
    params.set('filter', options.category);
  } else if (options.filter) {
    params.set('filter', options.filter);
  }

  if (options.search) {
    params.set('search', options.search);
  }

  const query = params.toString();
  return query ? `${baseUrl}/?${query}` : `${baseUrl}/`;
}
