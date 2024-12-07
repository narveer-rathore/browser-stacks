const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const isDev = require('electron-is-dev');
const { fileURLToPath } = require('url');

// Create __dirname equivalent
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Add device configurations with default browsers
const deviceConfigs = {
  devices: [
    {
      name: 'Desktop',
      currentBrowser: 'Chrome',
      supportedBrowsers: ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera']
    },
    {
      name: 'iPhone',
      currentBrowser: 'Safari',
      supportedBrowsers: ['Safari', 'Chrome', 'Firefox', 'Edge']
    },
    {
      name: 'Samsung',
      currentBrowser: 'Samsung Internet',
      supportedBrowsers: ['Samsung Internet', 'Chrome', 'Firefox', 'Edge', 'Opera']
    },
    {
      name: 'Xiaomi',
      currentBrowser: 'Chrome',
      supportedBrowsers: ['Chrome', 'Firefox', 'Edge', 'Opera']
    }
  ],
  browsers: [
    { name: 'Chrome', share: 63.56 },
    { name: 'Safari', share: 19.84 },
    { name: 'Edge', share: 4.84 },
    { name: 'Firefox', share: 3.02 },
    { name: 'Opera', share: 2.44 },
    { name: 'Samsung Internet', share: 2.35 }
  ]
};

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      webSecurity: true,
      additionalArguments: [JSON.stringify(deviceConfigs)]
    }
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:5173'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// Add IPC handlers for browser switching
ipcMain.handle('switch-browser', (event, { deviceName, newBrowser }) => {
  const device = deviceConfigs.devices.find(d => d.name === deviceName);
  if (device && device.supportedBrowsers.includes(newBrowser)) {
    device.currentBrowser = newBrowser;
    return { success: true, device };
  }
  return { success: false, error: 'Invalid device or browser' };
});

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
