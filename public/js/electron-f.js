const { ipcRenderer } = require('electron')

function openExternalLink(url) {
    ipcRenderer.send('open-url', url);
}
