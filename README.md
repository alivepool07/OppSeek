# 🔗 OppSeek

> Share job opportunities instantly with friends using unique connection codes

A Chrome extension that makes collaborative job hunting effortless. Connect with friends and share job postings with a simple right-click!

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- 🔗 **Easy Connections** - Connect with friends using unique 6-character codes
- ⚡ **Quick Sharing** - Share any job posting with a right-click
- 🔔 **Real-time Notifications** - Get notified instantly when friends share jobs
- 📝 **Add Notes** - Include context or tips when sharing
- 🔒 **Private & Secure** - Only connected friends see your shares
- 📱 **Clean Interface** - Simple, intuitive design
- 💻 **100% Free** - No subscriptions, no ads

---

## 🚀 Quick Install

### 1. Clone or Download
```bash
git clone https://github.com/alivepool07/OppSeek.git
```

Or click the green **"Code"** button above → **"Download ZIP"**

### 2. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top right)
3. Click **"Load unpacked"**
4. Select the `OppSeek` folder
5. Done! 🎉

The extension comes pre-configured with Firebase - just install and use!

---

## 📖 How to Use

### First Time Setup

1. **Get Your Code**
   - Click the Job Share extension icon
   - You'll see your unique 6-character connection code
   - Share this code with friends you want to connect with

2. **Add Friends**
   - Get your friend's code
   - Click the extension icon
   - Enter their code in "Add Friend" section
   - Click "Add"
   - You're now connected!

### Sharing Jobs

1. Navigate to any job posting
2. Right-click anywhere on the page
3. Select **"Share job with friends"**
4. Choose which friends to share with
5. Optionally add a note (e.g., "Great culture!" or "Remote friendly")
6. Click "Share"

Your friends will get an instant notification!

### Receiving Jobs

- When a friend shares a job, you'll see:
  - Browser notification
  - Badge on extension icon showing unread count
- Click the extension icon to see all shared jobs
- Click **"Open"** to view the job or **"Copy"** to copy the link
- Click **"×"** to dismiss jobs you're not interested in

---

## 🖼️ Screenshots

### Main Interface
Your connection code and shared jobs at a glance

### Share Flow
Right-click any job posting to share instantly

### Notifications
Real-time notifications when friends share opportunities

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Google Firebase (Firestore + Authentication)
- **Platform**: Chrome Extension Manifest V3
- **Security**: Firebase security rules, anonymous authentication

---

## 🔒 Privacy & Security

- ✅ **Anonymous Login** - No email or personal info required
- ✅ **Encrypted Storage** - All data secured by Firebase
- ✅ **Private by Default** - Only friends you connect with see your shares
- ✅ **No Tracking** - We don't track, sell, or share your data
- ✅ **Secure Rules** - Firebase security rules prevent unauthorized access

See our [Privacy Policy](https://alivepool07.github.io/OppSeek/privacy-policy.html) for full details.

---

## 📁 Project Structure
```
OppSeek/
├── manifest.json              # Extension configuration
├── src/
│   ├── background/
│   │   └── background.js      # Service worker (handles sharing, notifications)
│   ├── popup/
│   │   ├── popup.html         # Extension popup UI
│   │   ├── popup.js           # Popup logic (friends, jobs)
│   │   └── popup.css          # Popup styles
│   └── content/
│       └── content.js         # Content script
├── libs/
│   ├── firebase-app-compat.js         # Firebase core
│   ├── firebase-auth-compat.js        # Firebase auth
│   └── firebase-firestore-compat.js   # Firebase database
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

### How to Contribute

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Tips

- The extension uses Firebase Firestore for real-time sync
- Security rules are already configured in Firebase
- Test with multiple Chrome profiles to simulate different users
- Check browser console for errors

---

## 🐛 Troubleshooting

### Extension won't load
- Make sure all files are in the OppSeek folder
- Check `chrome://extensions/` for error messages
- Try reloading the extension

### Can't add friends
- Make sure you and your friend both have the extension installed
- Verify the connection code is exactly 6 characters
- Check that you're not trying to add yourself

### Jobs not showing up
- Ensure both users are connected as friends
- Check your internet connection
- Try refreshing the extension popup

### Context menu missing
- The menu only appears on `https://` websites (Chrome security)
- Try on a different website
- Reload the extension

Need more help? [Open an issue](https://github.com/alivepool07/OppSeek/issues)

---

## 📝 Roadmap

### Planned Features
- [ ] **Groups** - Share with multiple friends at once
- [ ] **Categories** - Tag jobs by industry, role type, etc.
- [ ] **Search** - Filter shared jobs
- [ ] **Export** - Download job list as CSV
- [ ] **Dark Mode** - Easy on the eyes
- [ ] **Multi-browser** - Firefox and Edge support
- [ ] **Job Boards** - Auto-detect and highlight apply buttons

Want to work on one of these? Open a PR! 🚀

---

## ❓ FAQ

**Q: Do I need to create a Firebase account?**  
A: No! The extension comes with Firebase already configured. Just install and use.

**Q: Is this really free?**  
A: Yes! 100% free, no hidden costs, no ads, no subscriptions.

**Q: Can my data be seen by others?**  
A: Only friends you explicitly connect with can see jobs you share with them. Your data is private.

**Q: Does this work on mobile?**  
A: Currently Chrome extensions only work on desktop. Mobile support may come later.

**Q: Can I use this for other things besides jobs?**  
A: Yes! You can share any URL - internships, freelance gigs, articles, resources, etc.

**Q: Is my connection code permanent?**  
A: Yes, each user gets one permanent code that doesn't change.

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**TL;DR:** You can use, modify, and distribute this code freely. Just keep the license notice.

---

## 👨‍💻 Author

**Anand** ([@alivepool07](https://github.com/alivepool07))

- 📧 Email: alivepool07@gmail.com
- 💼 GitHub: [@alivepool07](https://github.com/alivepool07)
- 🐛 Issues: [Report a bug](https://github.com/alivepool07/OppSeek/issues)

---

## 🙏 Acknowledgments

- Built with [Firebase](https://firebase.google.com/) for real-time sync
- Icons and inspiration from the Chrome Extensions community
- Thanks to all future contributors! ⭐

---

## ⭐ Show Your Support

If you find this project helpful, please consider:

- ⭐ **Starring** this repository
- 🐛 **Reporting bugs** or suggesting features
- 🔀 **Contributing** code improvements
- 📢 **Sharing** with friends who are job hunting

Every star motivates me to keep improving! 🚀

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/alivepool07/OppSeek?style=social)
![GitHub forks](https://img.shields.io/github/forks/alivepool07/OppSeek?style=social)
![GitHub issues](https://img.shields.io/github/issues/alivepool07/OppSeek)

---

**Made with ❤️ for job seekers everywhere**

*Happy job hunting! May you and your friends find amazing opportunities together.* 🎯
