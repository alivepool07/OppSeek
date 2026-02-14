// src/background/background.js
importScripts('/libs/firebase-app-compat.js');
importScripts('/libs/firebase-auth-compat.js');
importScripts('/libs/firebase-firestore-compat.js');

// Firebase config - your config looks good!
const firebaseConfig = {
  apiKey: "AIzaSyBKjxGHr2gvQljol7lku_IP9dIbKS3BdP4",
  authDomain: "oppseek-f1b57.firebaseapp.com",
  databaseURL: "https://oppseek-f1b57-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "oppseek-f1b57",
  storageBucket: "oppseek-f1b57.firebasestorage.app",
  messagingSenderId: "872821199205",
  appId: "1:872821199205:web:b6c4bdcffb5472c01d918c",
  measurementId: "G-4LRHH2RLPV"
};

let db = null;
let auth = null;
let currentUser = null;

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
auth = firebase.auth();
db = firebase.firestore();

// Auto sign-in anonymously
auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    console.log('User authenticated:', user.uid);
    await ensureUserExists(user.uid);
    listenForSharedJobs(user.uid);
  } else {
    console.log('Signing in anonymously...');
    await auth.signInAnonymously();
  }
});

// Generate unique 6-character code
// Generate unique 6-character code using crypto
function generateConnectionCode() {
  const array = new Uint32Array(2);
  crypto.getRandomValues(array);
  const code = (array[0].toString(36) + array[1].toString(36))
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 6);

  // Pad with random characters if needed
  if (code.length < 6) {
    const padding = crypto.getRandomValues(new Uint32Array(1))[0]
      .toString(36)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    return (code + padding).substring(0, 6);
  }

  return code;
}

// Ensure user document exists
async function ensureUserExists(userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      const connectionCode = generateConnectionCode();

      // Check if code already exists
      const existingCode = await db.collection('users')
        .where('connection_code', '==', connectionCode)
        .get();

      const finalCode = existingCode.empty ? connectionCode : generateConnectionCode();

      await db.collection('users').doc(userId).set({
        user_id: userId,
        connection_code: finalCode,
        display_name: '',
        created_at: firebase.firestore.FieldValue.serverTimestamp()
      });

      await chrome.storage.local.set({
        connectionCode: finalCode,
        userId: userId
      });
      console.log('New user created with code:', finalCode);
    } else {
      await chrome.storage.local.set({
        connectionCode: userDoc.data().connection_code,
        userId: userId
      });
      console.log('Existing user loaded with code:', userDoc.data().connection_code);
    }
  } catch (error) {
    console.error('Error ensuring user exists:', error);
  }
}

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'shareJob',
    title: 'Share job with friends',
    contexts: ['page', 'link']
  });
  console.log('Extension installed, context menu created');
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'shareJob') {
    const url = info.linkUrl || tab.url;
    const title = tab.title;

    await chrome.storage.local.set({
      pendingShare: {
        url: url,
        title: title,
        timestamp: Date.now()
      }
    });

    console.log('Job sharing initiated:', url);

    // Open the popup automatically
    try {
      await chrome.action.openPopup();
    } catch (e) {
      // Fallback: If openPopup fails (older Chrome), show notification
      console.log('Could not auto-open popup, user will need to click extension icon');
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Ready to Share!',
        message: 'Click the OppSeek icon to select friends and share this job.',
        priority: 2
      });
    }
  }
});

// Listen for new shared jobs
function listenForSharedJobs(userId) {
  db.collection('shared_jobs')
    .where('shared_to', 'array-contains', userId)
    .onSnapshot((snapshot) => {
      const unreadJobs = snapshot.docs.filter(doc => !doc.data().read);
      const unreadCount = unreadJobs.length;

      chrome.action.setBadgeText({
        text: unreadCount > 0 ? unreadCount.toString() : ''
      });
      chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const job = change.doc.data();
          if (!job.read && job.shared_by !== userId) {
            chrome.notifications.create({
              type: 'basic',
              iconUrl: 'icons/icon128.png',
              title: 'New Job Shared!',
              message: `${job.shared_by_name || 'A friend'} shared: ${job.title || 'a job'}`,
              priority: 2
            });
          }
        }
      });
    });
}

// Message handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getAuth') {
    sendResponse({ userId: currentUser?.uid });
  }
  return true;
});


//does nothing for now
function managejobs() {

}