/**
* A cache provider that can be used to cache data.
*
* This class provides methods for getting, setting, and checking if a key is cached.
*/
export class CacheProvider{
    private static cacheData = {};
    /**
    * Gets the cached data for the given key.
    *
    * @param key - The key of the cached data.
    * @returns The cached data, or `undefined` if the data is not cached.
    */
    public static getCache(key: string){
        return this.cacheData[key];
    }
    /**
    * Sets the cached data for the given key.
    *
    * @param key - The key of the cached data.
    * @param data - The data to cache.
    */
    public static setCache(key: string, data: any){
        this.cacheData[key] = data;
    }
    /**
    * Checks if the given key is cached.
    *
    * @param key - The key to check.
    * @returns `true` if the key is cached, `false` otherwise.
    */
    public static hasCache(key: string){
        return this.cacheData.hasOwnProperty(key);
    }
    /**
    * Deletes the cached data for the given key.
    *
    * @param key - The key of the cached data to delete.
    */
    public static deleteCache(key: string): void {
      if (this.hasCache(key)) {
        delete this.cacheData[key];
      }
    }
}