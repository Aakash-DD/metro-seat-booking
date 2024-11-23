import { Application } from '@nativescript/core';
import '@nativescript/firebase-core';
import { firebase } from '@nativescript/firebase-core';

Application.run({ moduleName: 'app-root' })
  .then(() => {
    return firebase.initializeApp({
      apiKey: "demo-key",
      projectId: "demo-project",
      storageBucket: "demo-bucket",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:abcdef"
    });
  })
  .then(() => {
    console.log("Firebase initialized successfully");
  })
  .catch(error => {
    console.error("Error during initialization:", error);
  });