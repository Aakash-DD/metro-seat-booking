import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.metroseatbooking',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
    codeCache: true
  },
  ios: {
    discardUncaughtJsExceptions: true
  }
} as NativeScriptConfig;