import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.footbapp',
  appName: 'Footbapp',
  webDir: 'out',
  server: {
    url: 'https://footbapp.app',
    cleartext: true,
  },
  ios: {
    buildNumber: '2',
  },
};

export default config;