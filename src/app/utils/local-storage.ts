import { LocalStorageKey } from '../models/local-storage-key';

export class LocalStorage {
  static getItem(key: LocalStorageKey): string {
    return localStorage.getItem(key) || '';
  }

  static setItem(key: LocalStorageKey, value: string) {
    localStorage.setItem(key, value);
  }

  static removeItem(key: LocalStorageKey) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}
