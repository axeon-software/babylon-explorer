const {app, BrowserWindow, ipcMain} = require('electron');
const {autoUpdater} = require("electron-updater");
let win; // this will store the window object

// creates the default window
function createDefaultWindow() {
    win = new BrowserWindow({width: 900, height: 680});
    win.loadURL(`file://${__dirname}/index.html`);
    win.on('closed', () => app.quit());
    return win;
}

// when the app is loaded create a BrowserWindow and check for updates
app.on('ready', function() {
    createDefaultWindow()
    autoUpdater.checkForUpdates();
});

// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on('update-downloaded', (info) => {
    win.webContents.send('updateReady')
});

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on("quitAndInstall", (event, arg) => {
    autoUpdater.quitAndInstall();
})
