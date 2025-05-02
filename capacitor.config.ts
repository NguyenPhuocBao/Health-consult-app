import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    SplashScreen: {
      androidScaleType: 'CENTER_CROP'
    }
  },
  server: {
    hostname: 'localhost',
    androidScheme: 'https',
    iosScheme: 'https',
    url: 'http://localhost:8100',
    cleartext: true,
    allowNavigation: ['*.ionicons.com']
  }
};

export default config;