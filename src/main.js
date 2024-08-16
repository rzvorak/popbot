const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { execFile } = require('child_process');

let flaskServer;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    minWidth: 600,
    maxWidth: 600,
    minHeight: 500,
    maxHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true
    },
  });

  mainWindow.loadURL('http://127.0.0.1:5000'); // Adjust URL as needed

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
};

app.whenReady().then(() => {
  const currentDir = __dirname;
  const parentDir = path.dirname(currentDir); 
  const grandParentDir = path.dirname(parentDir); 
  const exePath = path.join(grandParentDir, 'dist', 'refresh-handler.exe');
  
  console.log('Starting Flask server at:', exePath);

  flaskServer = execFile(exePath, [], (error, stdout, stderr) => {
    if (error) {
      console.error('Failed to start Flask server:', error);
      return;
    }
    if (stderr) {
      console.error('Flask server error output:', stderr);
      return;
    }
    console.log('Flask server output:', stdout);
  });

  createWindow();
}).catch(err => {
  console.error('Error during app initialization:', err);
});

app.on('before-quit', () => {
  if (flaskServer) {
    flaskServer.kill(); // Ensure the server is killed before quitting
  }
});

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