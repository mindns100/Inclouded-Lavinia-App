import pkg from '../../package.json';
export const environment = {
  production: false,
  version: pkg.version,
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  }
};