import Redis from 'ioredis';

type MemoryValue = {
  value: string;
  expiresAt: number;
};

export interface CacheClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
}

class MemoryCacheClient implements CacheClient {
  private store = new Map<string, MemoryValue>();

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }
}

class ValkeyCacheClient implements CacheClient {
  constructor(private readonly redis: Redis) {}

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(key, value, 'EX', ttlSeconds);
  }
}

let redisClient: Redis | null | undefined;
let cacheClient: CacheClient | undefined;

function getMemoryCacheSingleton(): MemoryCacheClient {
  const globalForCache = globalThis as typeof globalThis & {
    __memoryCyberCache?: MemoryCacheClient;
  };

  if (!globalForCache.__memoryCyberCache) {
    globalForCache.__memoryCyberCache = new MemoryCacheClient();
  }

  return globalForCache.__memoryCyberCache;
}

function createRedisClient(): Redis | null {
  if (redisClient !== undefined) {
    return redisClient;
  }

  const valkeyUrl = process.env.VALKEY_URL;

  if (!valkeyUrl) {
    redisClient = null;
    return redisClient;
  }

  redisClient = new Redis(valkeyUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false
  });

  return redisClient;
}

export async function getCacheClient(): Promise<CacheClient> {
  if (cacheClient) {
    return cacheClient;
  }

  const redis = createRedisClient();

  if (!redis) {
    cacheClient = getMemoryCacheSingleton();
    return cacheClient;
  }

  try {
    await redis.connect();
    cacheClient = new ValkeyCacheClient(redis);
    return cacheClient;
  } catch {
    cacheClient = getMemoryCacheSingleton();
    return cacheClient;
  }
}
