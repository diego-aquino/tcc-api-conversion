import { environment } from '@/config/environment';

const DEFAULT_CACHE_CONTROL_LOCAL_MAX_AGE = 60 * 60; // 1 hour
const DEFAULT_CACHE_CONTROL_REMOTE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const DEFAULT_CACHE_CONTROL_STALE_WHILE_REVALIDATE = 60; // 1 minute

export const DEFAULT_PUBLIC_CACHE_CONTROL_HEADER =
  environment.NODE_ENV === 'production'
    ? [
        'public',
        `max-age=${DEFAULT_CACHE_CONTROL_LOCAL_MAX_AGE}`,
        `s-maxage=${DEFAULT_CACHE_CONTROL_REMOTE_MAX_AGE}`,
        `stale-while-revalidate=${DEFAULT_CACHE_CONTROL_STALE_WHILE_REVALIDATE}`,
      ].join(', ')
    : undefined;
