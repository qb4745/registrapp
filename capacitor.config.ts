import { CapacitorConfig } from '@capacitor/cli';
import { Capacitor } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'registrapp',
  appName: 'registrapp',
  webDir: 'www',
  server: {
    // androidScheme:'https',
    url:"http://192.168.3.5:8100"
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      //launchAutoHide: true,
      launchFadeOutDuration: 1000,
      backgroundColor: "#de0f17",
      //androidSplashResourceName: "splash",
      //androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
  },
};

export default config;
