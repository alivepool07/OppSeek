// src/popup/popup.js

// Firebase config - replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyBKjxGHr2gvQljol7lku_IP9dIbKS3BdP4",
  authDomain: "oppseek-f1b57.firebaseapp.com",
  projectId: "oppseek-f1b57",
  storageBucket: "oppseek-f1b57.firebasestorage.app",
  messagingSenderId: "872821199205",
  appId: "1:872821199205:web:b6c4bdcffb5472c01d918c"
};

let db;
let auth;
let currentUser = null;
let friends = [];
let sharedJobs = [];
let sentJobs = [];

// DOM Elements
let connectionCodeEl;
let copyCodeBtn;
let friendCodeInput;
let addFriendBtn;
let addFriendStatus;
let friendsList;
let friendCount;
let jobsList;
let sentJobsList;
let receivedCount;
let sentCount;
let mainView;
let shareView;
let jobPreview;
let friendsCheckboxList;
let shareNote;
let cancelShareBtn;
let confirmShareBtn;
let settingsView;
let settingsBtn;
let backToMain;
let displayNameInput;
let saveNameBtn;
let saveNameStatus;
let settingsCode;
let copyCodeBtn2;
let chaiLink;
let qrModal;
let qrImage;
let closeQrBtn;

// QR Code image path - UPDATE THIS WITH YOUR QR CODE
const QR_CODE_PATH = '/assets/chai-qr.jpeg';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
  // Get DOM elements
  connectionCodeEl = document.getElementById('connectionCode');
  copyCodeBtn = document.getElementById('copyCodeBtn');
  friendCodeInput = document.getElementById('friendCodeInput');
  addFriendBtn = document.getElementById('addFriendBtn');
  addFriendStatus = document.getElementById('addFriendStatus');
  friendsList = document.getElementById('friendsList');
  friendCount = document.getElementById('friendCount');
  jobsList = document.getElementById('jobsList');
  sentJobsList = document.getElementById('sentJobsList');
  receivedCount = document.getElementById('receivedCount');
  sentCount = document.getElementById('sentCount');
  mainView = document.getElementById('mainView');
  shareView = document.getElementById('shareView');
  jobPreview = document.getElementById('jobPreview');
  friendsCheckboxList = document.getElementById('friendsCheckboxList');
  shareNote = document.getElementById('shareNote');
  cancelShareBtn = document.getElementById('cancelShareBtn');
  confirmShareBtn = document.getElementById('confirmShareBtn');
  settingsView = document.getElementById('settingsView');
  settingsBtn = document.getElementById('settingsBtn');
  backToMain = document.getElementById('backToMain');
  displayNameInput = document.getElementById('displayNameInput');
  saveNameBtn = document.getElementById('saveNameBtn');
  saveNameStatus = document.getElementById('saveNameStatus');
  settingsCode = document.getElementById('settingsCode');
  copyCodeBtn2 = document.getElementById('copyCodeBtn2');
  chaiLink = document.getElementById('chaiLink');
  qrModal = document.getElementById('qrModal');
  qrImage = document.getElementById('qrImage');
  closeQrBtn = document.getElementById('closeQrBtn');

  // Tab elements
  const tabBtns = document.querySelectorAll('.tab-btn');
  const receivedTab = document.getElementById('receivedTab');
  const sentTab = document.getElementById('sentTab');

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (btn.dataset.tab === 'received') {
        receivedTab.classList.remove('hidden');
        sentTab.classList.add('hidden');
      } else {
        receivedTab.classList.add('hidden');
        sentTab.classList.remove('hidden');
      }
    });
  });

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();

  // Wait for auth
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      currentUser = user;
      console.log('Popup: User authenticated:', user.uid);
      await loadUserData();
      await checkPendingShare();
    } else {
      console.log('Popup: No user, signing in...');
      await auth.signInAnonymously();
    }
  });

  // Event listeners
  copyCodeBtn.addEventListener('click', copyConnectionCode);
  addFriendBtn.addEventListener('click', addFriend);
  cancelShareBtn.addEventListener('click', cancelShare);
  settingsBtn.addEventListener('click', showSettings);
  backToMain.addEventListener('click', hideSettings);
  saveNameBtn.addEventListener('click', saveDisplayName);
  copyCodeBtn2.addEventListener('click', copyConnectionCode);
  confirmShareBtn.addEventListener('click', confirmShare);

  // Chai link handlers
  chaiLink.addEventListener('click', showQrModal);
  closeQrBtn.addEventListener('click', hideQrModal);
});

// Load user data
async function loadUserData() {
  try {
    // INSTANT: Load cached data first for immediate display
    const storage = await chrome.storage.local.get(['connectionCode', 'userId', 'cachedFriends', 'cachedJobs', 'cachedSentJobs']);
    console.log('Storage data:', storage);

    if (storage.connectionCode) {
      connectionCodeEl.textContent = storage.connectionCode;
    } else {
      connectionCodeEl.textContent = '------';
    }

    // Show cached friends immediately
    if (storage.cachedFriends && storage.cachedFriends.length > 0) {
      friends = storage.cachedFriends;
      renderFriends();
    }

    // Show cached received jobs immediately
    if (storage.cachedJobs && storage.cachedJobs.length > 0) {
      sharedJobs = storage.cachedJobs;
      renderSharedJobs();
    }

    // Show cached sent jobs immediately
    if (storage.cachedSentJobs && storage.cachedSentJobs.length > 0) {
      sentJobs = storage.cachedSentJobs;
      renderSentJobs();
    }

    // Then fetch fresh data from Firebase (updates will replace cached data)
    await loadFriends();
    loadSharedJobs();
    loadSentJobs();
  } catch (error) {
    console.error('Error loading user data:', error);
  }
}

// Load friends
async function loadFriends() {
  try {
    const connections1 = await db.collection('connections')
      .where('user1_id', '==', currentUser.uid)
      .get();

    const connections2 = await db.collection('connections')
      .where('user2_id', '==', currentUser.uid)
      .get();

    friends = [];

    for (const doc of connections1.docs) {
      const data = doc.data();
      const friendDoc = await db.collection('users').doc(data.user2_id).get();
      if (friendDoc.exists) {
        const friendData = friendDoc.data();
        friends.push({
          id: data.user2_id,
          code: friendData.connection_code,
          displayName: friendData.display_name || '',
          connectionId: doc.id
        });
      }
    }

    for (const doc of connections2.docs) {
      const data = doc.data();
      const friendDoc = await db.collection('users').doc(data.user1_id).get();
      if (friendDoc.exists) {
        const friendData = friendDoc.data();
        friends.push({
          id: data.user1_id,
          code: friendData.connection_code,
          displayName: friendData.display_name || '',
          connectionId: doc.id
        });
      }
    }

    console.log('Loaded friends:', friends);

    // Cache friends for instant load next time
    await chrome.storage.local.set({ cachedFriends: friends });

    renderFriends();
  } catch (error) {
    console.error('Error loading friends:', error);
  }
}

// Render friends list
function renderFriends() {
  friendCount.textContent = friends.length;

  if (friends.length === 0) {
    friendsList.innerHTML = '<div class="empty-state"><p>No friends yet</p><p style="font-size: 12px;">Add friends to start sharing jobs!</p></div>';
    return;
  }

  friendsList.innerHTML = friends.map(friend => {
    const displayText = friend.displayName ? `${friend.displayName} (${friend.code})` : `Friend: ${friend.code}`;
    return `
    <div class="list-item">
      <span>${displayText}</span>
      <button class="btn-secondary remove-friend" data-connection-id="${friend.connectionId}" style="padding: 6px 12px; font-size: 12px;">Remove</button>
    </div>
  `;
  }).join('');

  document.querySelectorAll('.remove-friend').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const connectionId = e.target.dataset.connectionId;
      removeFriend(connectionId);
    });
  });
}

// Remove friend
async function removeFriend(connectionId) {
  if (confirm('Remove this friend?')) {
    try {
      await db.collection('connections').doc(connectionId).delete();
      await loadFriends();
      showStatus('Friend removed', 'success');
    } catch (error) {
      console.error('Error removing friend:', error);
      showStatus('Error removing friend', 'error');
    }
  }
}

// Load shared jobs
function loadSharedJobs() {
  // Query without orderBy to avoid needing composite index
  // We'll sort client-side instead
  db.collection('shared_jobs')
    .where('shared_to', 'array-contains', currentUser.uid)
    .limit(50)
    .onSnapshot((snapshot) => {
      sharedJobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by timestamp client-side (newest first)
      sharedJobs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      // Limit to 20 after sorting
      sharedJobs = sharedJobs.slice(0, 20);

      // Cache jobs for instant load next time
      chrome.storage.local.set({ cachedJobs: sharedJobs });

      renderSharedJobs();
    }, (error) => {
      console.error('Error loading shared jobs:', error);
      // If query fails, try simpler query without any ordering
      db.collection('shared_jobs')
        .where('shared_to', 'array-contains', currentUser.uid)
        .get()
        .then(snapshot => {
          sharedJobs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          sharedJobs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          sharedJobs = sharedJobs.slice(0, 20);
          chrome.storage.local.set({ cachedJobs: sharedJobs });
          renderSharedJobs();
        });
    });
}

// Render shared jobs (received)
function renderSharedJobs() {
  receivedCount.textContent = sharedJobs.length;

  if (sharedJobs.length === 0) {
    jobsList.innerHTML = '<div class="empty-state"><p>No jobs received yet</p></div>';
    return;
  }

  jobsList.innerHTML = sharedJobs.map(job => `
    <div class="list-item job-item ${!job.read ? 'unread' : ''}" data-job-id="${job.id}">
      <div class="job-info">
        <h4>${job.title || 'Job Posting'}</h4>
        <p>From: ${job.shared_by_name || job.shared_by.substring(0, 8)}</p>
        ${job.note ? `<p style="font-style: italic;">"${job.note}"</p>` : ''}
        <p style="font-size: 11px; opacity: 0.6;">${formatTimeAgo(job.timestamp)}</p>
      </div>
      <div class="job-actions">
        <button class="job-open" data-url="${job.url}" data-id="${job.id}">Open</button>
        <button class="job-copy" data-url="${job.url}" data-id="${job.id}">Copy</button>
        <button class="job-dismiss" data-id="${job.id}">✕</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.job-open').forEach(btn => {
    btn.addEventListener('click', (e) => {
      openJob(e.target.dataset.url, e.target.dataset.id);
    });
  });

  document.querySelectorAll('.job-copy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      copyJobUrl(e.target.dataset.url, e.target.dataset.id);
    });
  });

  document.querySelectorAll('.job-dismiss').forEach(btn => {
    btn.addEventListener('click', (e) => {
      dismissJob(e.target.dataset.id);
    });
  });
}

// Load sent jobs (shared by me)
function loadSentJobs() {
  db.collection('shared_jobs')
    .where('shared_by', '==', currentUser.uid)
    .limit(50)
    .onSnapshot((snapshot) => {
      sentJobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by timestamp client-side (newest first)
      sentJobs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      sentJobs = sentJobs.slice(0, 20);

      // Cache sent jobs
      chrome.storage.local.set({ cachedSentJobs: sentJobs });

      renderSentJobs();
    }, (error) => {
      console.error('Error loading sent jobs:', error);
    });
}

// Render sent jobs
function renderSentJobs() {
  sentCount.textContent = sentJobs.length;

  if (sentJobs.length === 0) {
    sentJobsList.innerHTML = '<div class="empty-state"><p>No jobs shared yet</p><p style="font-size: 11px;">Right-click any page to share!</p></div>';
    return;
  }

  sentJobsList.innerHTML = sentJobs.map(job => `
    <div class="list-item job-item" data-job-id="${job.id}">
      <div class="job-info">
        <h4>${job.title || 'Job Posting'}</h4>
        <p>To: ${job.shared_to.length} friend${job.shared_to.length > 1 ? 's' : ''}</p>
        ${job.note ? `<p style="font-style: italic;">"${job.note}"</p>` : ''}
        <p style="font-size: 11px; opacity: 0.6;">${formatTimeAgo(job.timestamp)}</p>
      </div>
      <div class="job-actions">
        <button class="sent-job-open" data-url="${job.url}">Open</button>
        <button class="sent-job-delete" data-id="${job.id}">Delete</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.sent-job-open').forEach(btn => {
    btn.addEventListener('click', (e) => {
      chrome.tabs.create({ url: e.target.dataset.url });
    });
  });

  document.querySelectorAll('.sent-job-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const jobId = e.target.dataset.id;
      if (confirm('Delete this shared job?')) {
        await db.collection('shared_jobs').doc(jobId).delete();
      }
    });
  });
}

// Format time ago
function formatTimeAgo(timestamp) {
  if (!timestamp) return '';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

async function openJob(url, jobId) {
  chrome.tabs.create({ url });
  await markAsRead(jobId);
}

async function copyJobUrl(url, jobId) {
  await navigator.clipboard.writeText(url);
  await markAsRead(jobId);
  showStatus('Copied to clipboard!', 'success');
}

async function markAsRead(jobId) {
  try {
    await db.collection('shared_jobs').doc(jobId).update({ read: true });
  } catch (error) {
    console.error('Error marking as read:', error);
  }
}

async function dismissJob(jobId) {
  try {
    await db.collection('shared_jobs').doc(jobId).delete();
  } catch (error) {
    console.error('Error dismissing job:', error);
  }
}

async function copyConnectionCode() {
  const code = connectionCodeEl.textContent;
  await navigator.clipboard.writeText(code);
  showStatus('Code copied!', 'success');
}

async function addFriend() {
  const code = friendCodeInput.value.trim().toUpperCase();

  if (!code || code.length !== 6) {
    showStatus('Please enter a valid 6-character code', 'error');
    return;
  }

  if (code === connectionCodeEl.textContent) {
    showStatus('You cannot add yourself!', 'error');
    return;
  }

  addFriendBtn.disabled = true;
  addFriendBtn.textContent = 'Adding...';

  try {
    const usersSnapshot = await db.collection('users')
      .where('connection_code', '==', code)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      showStatus('No user found with this code', 'error');
      addFriendBtn.disabled = false;
      addFriendBtn.textContent = 'Add';
      return;
    }

    const friendId = usersSnapshot.docs[0].id;

    const existingConnection = friends.find(f => f.id === friendId);
    if (existingConnection) {
      showStatus('Already connected to this user', 'error');
      addFriendBtn.disabled = false;
      addFriendBtn.textContent = 'Add';
      return;
    }

    await db.collection('connections').add({
      user1_id: currentUser.uid,
      user2_id: friendId,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    });

    showStatus('Friend added successfully!', 'success');
    friendCodeInput.value = '';
    await loadFriends();

  } catch (error) {
    console.error('Error adding friend:', error);
    showStatus('Error adding friend: ' + error.message, 'error');
  }

  addFriendBtn.disabled = false;
  addFriendBtn.textContent = 'Add';
}

async function checkPendingShare() {
  const storage = await chrome.storage.local.get(['pendingShare']);

  if (storage.pendingShare) {
    const { url, title } = storage.pendingShare;
    showShareView(url, title);
    await chrome.storage.local.remove('pendingShare');
  }
}

function showShareView(url, title) {
  mainView.classList.add('hidden');
  shareView.classList.remove('hidden');

  jobPreview.innerHTML = `
    <h4>${title}</h4>
    <p>${url}</p>
  `;

  if (friends.length === 0) {
    friendsCheckboxList.innerHTML = '<div class="empty-state"><p>No friends to share with</p><p style="font-size: 12px;">Add friends first!</p></div>';
  } else {
    friendsCheckboxList.innerHTML = friends.map(friend => {
      const displayText = friend.displayName ? `${friend.displayName} (${friend.code})` : `Friend: ${friend.code}`;
      return `
      <div class="checkbox-item">
        <input type="checkbox" id="friend-${friend.id}" value="${friend.id}">
        <label for="friend-${friend.id}">${displayText}</label>
      </div>`;
    }).join('');
  }

  shareView.dataset.url = url;
  shareView.dataset.title = title;
}

function cancelShare() {
  shareView.classList.add('hidden');
  mainView.classList.remove('hidden');
  shareNote.value = '';
}

async function confirmShare() {
  const selectedFriends = Array.from(
    friendsCheckboxList.querySelectorAll('input[type="checkbox"]:checked')
  ).map(cb => cb.value);

  if (selectedFriends.length === 0) {
    alert('Please select at least one friend');
    return;
  }

  confirmShareBtn.disabled = true;
  confirmShareBtn.textContent = 'Sharing...';

  try {
    const url = shareView.dataset.url;
    const title = shareView.dataset.title;
    const note = shareNote.value.trim();

    const userData = await db.collection('users').doc(currentUser.uid).get();
    const userDataObj = userData.data();
    const sharedByName = userDataObj.display_name || userDataObj.connection_code;

    await db.collection('shared_jobs').add({
      url: url,
      title: title,
      note: note,
      shared_by: currentUser.uid,
      shared_by_name: sharedByName,
      shared_to: selectedFriends,
      timestamp: Date.now(),
      read: false
    });

    showStatus('Job shared successfully!', 'success');

    setTimeout(() => {
      shareView.classList.add('hidden');
      mainView.classList.remove('hidden');
      shareNote.value = '';
      confirmShareBtn.disabled = false;
      confirmShareBtn.textContent = 'Share';
    }, 1000);

  } catch (error) {
    console.error('Error sharing job:', error);
    alert('Error sharing job: ' + error.message);
    confirmShareBtn.disabled = false;
    confirmShareBtn.textContent = 'Share';
  }
}

function showStatus(message, type) {
  addFriendStatus.textContent = message;
  addFriendStatus.className = `status-message ${type}`;

  setTimeout(() => {
    addFriendStatus.className = 'status-message';
  }, 3000);
}

// Settings functions
function showSettings() {
  mainView.classList.add('hidden');
  settingsView.classList.remove('hidden');

  // Load current display name
  const code = connectionCodeEl.textContent;
  settingsCode.textContent = code;

  // Fetch current display name from Firestore
  if (currentUser) {
    db.collection('users').doc(currentUser.uid).get()
      .then(doc => {
        if (doc.exists && doc.data().display_name) {
          displayNameInput.value = doc.data().display_name;
        }
      });
  }
}

function hideSettings() {
  settingsView.classList.add('hidden');
  mainView.classList.remove('hidden');
}

async function saveDisplayName() {
  const name = displayNameInput.value.trim();

  if (!name) {
    showSettingsStatus('Please enter a name', 'error');
    return;
  }

  saveNameBtn.disabled = true;
  saveNameBtn.textContent = 'Saving...';

  try {
    await db.collection('users').doc(currentUser.uid).update({
      display_name: name
    });

    showSettingsStatus('Name saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving display name:', error);
    showSettingsStatus('Error saving name', 'error');
  }

  saveNameBtn.disabled = false;
  saveNameBtn.textContent = 'Save';
}

function showSettingsStatus(message, type) {
  saveNameStatus.textContent = message;
  saveNameStatus.className = `status-message ${type}`;

  setTimeout(() => {
    saveNameStatus.className = 'status-message';
  }, 3000);
}

// QR Modal functions
function showQrModal() {
  qrImage.src = QR_CODE_PATH;
  qrModal.classList.remove('hidden');
}

function hideQrModal() {
  qrModal.classList.add('hidden');
}

// Check for pending share
function checkPendingShare() {

}