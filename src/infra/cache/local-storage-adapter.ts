import { GetStorage, SetStorage } from '@/data/protocols/cache';

export class LocalStorageAdapter implements SetStorage, GetStorage {
  get(key: string): any {
    return JSON.parse(localStorage.getItem(key));
  }

  set(key: string, value: object): void {
    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
      return;
    }

    localStorage.removeItem(key);
  }
}
