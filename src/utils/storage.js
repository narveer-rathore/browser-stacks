const STORAGE_KEYS = {
  DEVICES: 'responsive-viewer-devices',
  PREFERENCES: 'responsive-viewer-preferences',
  URL_HISTORY: 'responsive-viewer-url-history',
  CUSTOM_CSS: 'responsive-viewer-custom-css'
};

// Default preferences
export const defaultPreferences = {
  scale: 1,
  syncScroll: true,
  networkThrottle: null,
  customCss: '',
  lastUrl: ''
};

// Default devices if none exist in storage
export const defaultDevices = [
  {
    id: 'iphone-12-pro',
    name: 'iPhone 12 Pro',
    width: 390,
    height: 844,
    enabled: true,
    order: 0,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'pixel-5',
    name: 'Pixel 5',
    width: 393,
    height: 851,
    enabled: true,
    order: 1,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36'
  },
  {
    id: 'ipad-air',
    name: 'iPad Air',
    width: 820,
    height: 1180,
    enabled: false,
    order: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  }
];

class Storage {
  constructor() {
    this.isAvailable = this._checkStorageAvailability();
  }

  _checkStorageAvailability() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      console.warn('LocalStorage is not available:', e);
      return false;
    }
  }

  get(key) {
    if (!this.isAvailable) return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from storage: ${key}`, error);
      return null;
    }
  }

  set(key, value) {
    if (!this.isAvailable) return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to storage: ${key}`, error);
      return false;
    }
  }

  remove(key) {
    if (!this.isAvailable) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from storage: ${key}`, error);
    }
  }

  // Specific getters and setters
  getDevices() {
    return this.get(STORAGE_KEYS.DEVICES) || defaultDevices;
  }

  setDevices(devices) {
    return this.set(STORAGE_KEYS.DEVICES, devices);
  }

  getPreferences() {
    return {
      ...defaultPreferences,
      ...this.get(STORAGE_KEYS.PREFERENCES)
    };
  }

  setPreferences(preferences) {
    return this.set(STORAGE_KEYS.PREFERENCES, preferences);
  }

  getUrlHistory() {
    return this.get(STORAGE_KEYS.URL_HISTORY) || [];
  }

  setUrlHistory(history) {
    return this.set(STORAGE_KEYS.URL_HISTORY, history);
  }

  getCustomCss() {
    return this.get(STORAGE_KEYS.CUSTOM_CSS) || '';
  }

  setCustomCss(css) {
    return this.set(STORAGE_KEYS.CUSTOM_CSS, css);
  }

  // Clear all stored data
  clearAll() {
    if (!this.isAvailable) return;
    Object.values(STORAGE_KEYS).forEach(key => {
      this.remove(key);
    });
  }
}

// Export a singleton instance
export const storage = new Storage();

// Export storage keys for external use
export { STORAGE_KEYS };
