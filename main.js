const { app, BrowserWindow, shell, ipcMain, Menu, Notification } = require('electron');
const ejse = require('ejs-electron');
const path = require('path');
var player = require('play-sound')(opts = {});

require('update-electron-app')({
  repo: 'ianmora97/content-automation',
  updateInterval: '1 hour'
})

function createWindow () {
    const win = new BrowserWindow({
        width: 1500,
        height: 800,
        minWidth: 1500,
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
    win.setIcon(path.join(__dirname, '/public/img/logo.png'));
    win.removeMenu();
    win.loadFile('public/views/index.ejs')
}
// menu
const isMac = process.platform === 'darwin'

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// open links in external browser
ipcMain.on('open-url', (event, arg) => {
    if(arg.includes('https://')){
        shell.openExternal(arg)
    }else{
        shell.openExternal('https://'+arg)
    }
    
})
// Send A Notification
ipcMain.on('notification-jira', (event, arg) => {
	player.play(path.join(__dirname, arg.args.sound), function(err){
		if (err) throw err
	});
	arg.args.icon = path.join(__dirname, arg.args.icon);
	const notification = new Notification(arg.args);
		notification.on('click', (event, argNot) => {
			shell.openExternal(arg.url)
	});
    notification.show()    
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