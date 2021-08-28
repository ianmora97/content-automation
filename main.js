const { app, BrowserWindow, shell, ipcMain } = require('electron')
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
    win.loadFile('index.ejs')
}

// open links in external browser
ipcMain.on('open-url', (event, arg) => {
    if(arg.includes('https://')){
        shell.openExternal(arg)
    }else{
        shell.openExternal('https://'+arg)
    }
    
})

// open window on ready
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