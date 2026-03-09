/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Strict Mode 在 dev 雙重執行 useEffect，導致 WebSocket 在 CONNECTING 時就被 cleanup 關閉
  // 這只影響開發環境，production build 不受影響
  reactStrictMode: false,

  webpack: (config) => {
    // MetaMask SDK 帶入 React Native 依賴，在 Web 環境用 stub 替代
    config.resolve.alias['@react-native-async-storage/async-storage'] =
      path.resolve(__dirname, 'mocks/async-storage.js');

    return config;
  },
};

module.exports = nextConfig;
