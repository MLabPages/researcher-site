// Firebase ConsoleでWebアプリを登録したあと、表示された設定をここに貼ります。
// この設定値（apiKeyを含む）はFirebaseの仕様上、Webページで公開される識別情報です。
// データ保護は firestore.rules で行います。サービスアカウントの秘密鍵は絶対に置かないでください。
window.MLAB_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBO5Mzg7Rlbq1542CMr_i6BMI6EA58HjHM",
  authDomain: "mlab-tool-plaza.firebaseapp.com",
  projectId: "mlab-tool-plaza",
  storageBucket: "mlab-tool-plaza.firebasestorage.app",
  messagingSenderId: "712632732043",
  appId: "1:712632732043:web:37e60cbd1e7069e647878e",
  measurementId: "G-FBGV1S1KF0",
};

// reCAPTCHA EnterpriseのサイトキーはWebページに含める公開情報です。
window.MLAB_APP_CHECK_SITE_KEY = "6LcKD1UtAAAAAAtys5oB0nkGAtA-ESv6MmnJntpy";

// 設定例:
// window.MLAB_FIREBASE_CONFIG = {
//   apiKey: "...",
//   authDomain: "プロジェクトID.firebaseapp.com",
//   projectId: "プロジェクトID",
//   storageBucket: "プロジェクトID.firebasestorage.app",
//   messagingSenderId: "...",
//   appId: "...",
// };
