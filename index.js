const {app, BrowserWindow, ipcMain} = require('electron');

// https://electronjs.org/docs/api/auto-updater
const {autoUpdater} = require("electron-updater");
let win; // this will store the window object

// creates the default window
function createDefaultWindow() {
    win = new BrowserWindow({width: 900, height: 680});
    win.loadURL(`file://${__dirname}/app/index.html`);
    win.on('closed', () => app.quit());
    return win;
}

require('./app/menu/mainMenu');

// when the app is loaded create a BrowserWindow and check for updates
app.on('ready', function() {
    createDefaultWindow();
    autoUpdater.checkForUpdates();
});

app.on('open-file', function() {
    alert("open File");
   console.log("yoooooooooooo", arguments);
});

// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on('update-downloaded', (info) => {
    win.webContents.send('updateReady')
});

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on("quitAndInstall", (event, arg) => {
    autoUpdater.quitAndInstall();
});

// read the file and send data to the render process
ipcMain.on('get-file-data', function(event) {
    console.log("get-file-data");
    var data = null
    if (process.platform == 'win32' && process.argv.length >= 2) {
        var openFilePath = process.argv[1]
        data = openFilePath
    }
    event.returnValue = data
});