const { ipcRenderer } = require('electron')

function openExternalLink(url) {
    ipcRenderer.send('open-url', url);
}
function sendNotificationJira(options){
    ipcRenderer.send('notification-jira', options);
}