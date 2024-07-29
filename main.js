const { app, BrowserWindow, session, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true, // Enable the default window frame with minimize, maximize, and close buttons
    icon: path.join(__dirname, 'assets', 'image.jpg'), // Path to your icon file
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the ChatGPT website
  win.loadURL('https://chatgpt.com/');

  const ses = win.webContents.session;

  // Restore cookies on app start
  ses.cookies.get({ url: 'https://chatgpt.com' }, (error, cookies) => {
    if (error) {
      console.error('Failed to get cookies:', error);
      return;
    }
    console.log('Cookies restored:', cookies);
    // You can set cookies here if necessary
  });

  // Save cookies on app close
  app.on('before-quit', () => {
    ses.cookies.flushStore().then(() => {
      console.log('Cookies saved successfully.');
    }).catch(err => {
      console.error('Failed to save cookies:', err);
    });
  });

  // Remove the default menu
  Menu.setApplicationMenu(null);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
