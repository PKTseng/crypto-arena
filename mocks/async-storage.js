// Stub for @react-native-async-storage/async-storage
// MetaMask SDK pulls this in as a dependency; in a web environment we replace it with localStorage.
const AsyncStorage = {
  getItem:    async (key) => localStorage.getItem(key),
  setItem:    async (key, value) => localStorage.setItem(key, value),
  removeItem: async (key) => localStorage.removeItem(key),
  clear:      async () => localStorage.clear(),
  getAllKeys:  async () => Object.keys(localStorage),
  multiGet:   async (keys) => keys.map((k) => [k, localStorage.getItem(k)]),
  multiSet:   async (pairs) => pairs.forEach(([k, v]) => localStorage.setItem(k, v)),
  multiRemove: async (keys) => keys.forEach((k) => localStorage.removeItem(k)),
};

module.exports = AsyncStorage;
