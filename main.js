const { app, BrowserWindow, session, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true, 
    icon: path.join(__dirname, 'assets', 'image.jpg'), 
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  
  win.loadURL('https://chatgpt.com/');

  const ses = win.webContents.session;


  ses.cookies.get({ url: 'https://chatgpt.com' }, (error, cookies) => {
    if (error) {
      console.error('Failed to get cookies:', error);
      return;
    }
    console.log('Cookies restored:', cookies);

  });

  app.on('before-quit', () => {
    ses.cookies.flushStore().then(() => {
      console.log('Cookies saved successfully.');
    }).catch(err => {
      console.error('Failed to save cookies:', err);
    });
  });


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
