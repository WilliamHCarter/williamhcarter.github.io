const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

/**
 * Resolves an internal site path against Astro's configured base URL.
 * Archive builds set that base to `/archive/<release-id>`.
 */
export function sitePath(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath}` || "/";
}
