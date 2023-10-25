import { CapacitorConfig } from '@capacitor/cli';
import { Capacitor } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'REGISTRAPP',
  webDir: 'www',
  server: {
    androidScheme:'https'
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
