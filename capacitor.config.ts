import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.footbapp',
  appName: 'Footbapp',
  webDir: 'out',
  server: {
    url: 'https://footbapp.app',
    cleartext: true,
  },
};

export default config;