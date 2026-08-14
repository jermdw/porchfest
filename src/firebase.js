import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getAuth, connectAuthEmulator, signInWithCredential, GoogleAuthProvider } from 'firebase/auth'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'

const firebaseConfig = {
  projectId: 'senoiaporchfest',
  appId: '1:1017364110090:web:fe6044c2ebc7fccb0878f3',
  storageBucket: 'senoiaporchfest.firebasestorage.app',
  apiKey: 'AIzaSyBOEVg_8g6UOCH7eGjOksefbHLlpDzdo1Y',
  authDomain: 'senoiaporchfest.firebaseapp.com',
  messagingSenderId: '1017364110090',
}

export const app = initializeApp(firebaseConfig)

// App Check (invisible reCAPTCHA Enterprise). Empty key = disabled: register a
// reCAPTCHA Enterprise key for senoiaporchfest first, paste it here, and flip
// enforceAppCheck in functions/index.js in the same deploy — enforcing before
// the client has a key breaks every signup.
const APP_CHECK_SITE_KEY = ''
if (import.meta.env.PROD && APP_CHECK_SITE_KEY) {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(APP_CHECK_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  })
}
export const db = getFirestore(app)
export const functions = getFunctions(app)
export const auth = getAuth(app)

if (import.meta.env.DEV) {
  // Ports offset from the defaults so this can run beside the car show's
  // emulator suite (8080/5001/9099) — keep in sync with firebase.json.
  connectFirestoreEmulator(db, 'localhost', 8081)
  connectFunctionsEmulator(functions, 'localhost', 5002)
  connectAuthEmulator(auth, 'http://localhost:9098', { disableWarnings: true })
  // Emulator-only: lets tests sign in without the Google popup flow
  window.__testSignIn = (email) =>
    signInWithCredential(
      auth,
      GoogleAuthProvider.credential(JSON.stringify({ sub: email, email, email_verified: true })),
    )
}

export const EVENT_ID = '2026'
