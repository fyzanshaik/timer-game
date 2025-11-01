export class KVCache {
  constructor(private kv: KVNamespace) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.kv.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  async set<T>(key: string, value: T, expirationTtl?: number): Promise<void> {
    await this.kv.put(key, JSON.stringify(value), { expirationTtl });
  }

  async delete(key: string): Promise<void> {
    await this.kv.delete(key);
  }

  async deleteMany(...keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.delete(key)));
  }

  userKey(username: string): string {
    return `user:${username}`;
  }

  leaderboardKey(timerName: string): string {
    return `leaderboard:${timerName}`;
  }
}
