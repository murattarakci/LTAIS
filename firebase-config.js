// Firebase configuration for collecting submitted cards.
//
// Setup (about 10 minutes, one time):
//   1. Go to https://console.firebase.google.com and click "Add project"
//      (any name, e.g. "ltais-cards"; Google Analytics can be off).
//   2. In the project: Build -> Firestore Database -> Create database
//      -> Start in production mode -> pick europe-west6 (Zurich).
//   3. In Firestore -> Rules, paste and publish:
//        rules_version = '2';
//        service cloud.firestore {
//          match /databases/{database}/documents {
//            match /cards/{card} {
//              allow read, create, update: if true;
//              allow delete: if false;
//            }
//          }
//        }
//   4. Project overview -> Web (</> icon) -> register app -> copy the
//      firebaseConfig object and paste it below, replacing null.
//
// Until this is filled in, the card page works normally and simply
// does not record submissions; the facilitator view shows a notice.
//
// These values are public identifiers, not secrets: access is controlled by
// the Firestore rules above, not by hiding this config.
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyDIClcTcAoWxgmHvtoWN7YZduICwxdAYKA",
  authDomain: "ltais-f31a0.firebaseapp.com",
  projectId: "ltais-f31a0",
  storageBucket: "ltais-f31a0.firebasestorage.app",
  messagingSenderId: "953468160360",
  appId: "1:953468160360:web:3d1388541e46bc1b2faedd"
};
