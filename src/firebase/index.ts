import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase.config";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaV3Provider } from "@firebase/app-check";

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

if (import.meta.env.DEV) self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(
    import.meta.env.VITE_PUBLIC_RECAPTCHA_SITE_KEY
  ),
  isTokenAutoRefreshEnabled: true,
});

export { analytics, auth, db, storage };
