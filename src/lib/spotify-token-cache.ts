type TokenCache = {
  access_token: string;
  expires_at: number;
};

class SpotifyTokenCache {
  private static instance: SpotifyTokenCache;
  private cache: TokenCache | null = null;

  private constructor() {}

  static getInstance(): SpotifyTokenCache {
    if (!this.instance) {
      this.instance = new SpotifyTokenCache();
    }
    return this.instance;
  }

  setToken(token: string, expiresIn: number) {
    this.cache = {
      access_token: token,
      expires_at: Date.now() + expiresIn * 1000,
    };
  }

  getToken(): string | null {
    if (!this.cache || Date.now() > this.cache.expires_at) {
      return null;
    }
    return this.cache.access_token;
  }

  clear() {
    this.cache = null;
  }
}

export const tokenCache = SpotifyTokenCache.getInstance();
