// const {app, BrowserWindow, systemPreferences, Tray, shell , ipcMain} = require('electron');
// const path = require('path')

// function createWindow() {
//     const win = new BrowserWindow({
//         width: 1500,
//         height: 800,
//         minWidth: 1200,
//         minHeight:720,
//         show: false,
//         resizable: true,
//         backgroundColor: '#2B2D42',
//         webPreferences:{
//             preload: path.join(__dirname, 'preload.js')
//         }
//     })
//     win.once('ready-to-show', () => {
//         win.show()
//     })
//     win.setIcon(path.join(__dirname, '/images/icon.png'));
//     //win.removeMenu();
//     win.loadFile(path.join(__dirname,"index.html"));
// }

// ipcMain.on('open-url', (event, arg) => {
//     if(arg.includes('https://')){
//         shell.openExternal(arg)
//     }else{
//         shell.openExternal('https://'+arg)
//     }
// })

// app.whenReady().then(() => {
//     createWindow()
//     app.on('activate', function () {
//       if (BrowserWindow.getAllWindows().length === 0) createWindow()
//     })
// })

// app.on('window-all-closed', function () {
//     if (process.platform !== 'darwin') app.quit()
// })

const { app, BrowserWindow } = require('electron')
const ejse = require('ejs-electron')
const path = require('path')

function createWindow () {
    const win = new BrowserWindow({
        width: 1500,
        height: 800,
        minWidth: 1200,
        minHeight:720,
        show: false,
        resizable: true,
        backgroundColor: '#1A1A1A',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    win.once('ready-to-show', () => {
        win.show()
    })
    // win.setIcon(path.join(__dirname, '/public/img/logo.svg'));
    win.removeMenu();
    win.loadFile('views/index.ejs')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})