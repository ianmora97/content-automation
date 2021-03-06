chrome.runtime.onInstalled.addListener(() => {
    console.log('Links loaded');
});

chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        case 'toggleGrid':
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { msg: "toggleGrid" });
            })
            break;
        case 'toggleSpacers':
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { msg: "toggleSpacers" });
            })
            break;
        case 'showHeaders':
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { msg: "showHeaders" });
            })
            break;
        case 'placeholder':
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                // chrome.tabs.sendMessage(tabs[0].id, { msg: "placeholder" });
            })
            break;
        default:
            console.log(`Command ${command} not found`);
    }
});

// ! ------------------------------------------ Right Click ------------------------------------------
// TODO: 
function openAuthor(info,tab) {
	let editor_path = info.selectionText;
	if(info.selectionText.includes('bmwusa.com')){
		editor_path = `https://author.staging.bmwusacm.co/editor.html/content/bmwusa/${info.selectionText.split(".com/")[1]}`
        if(editor_path.match("no-cache")){
            editor_path = editor_path.replace(".no-cache","");
        }
        chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
            chrome.tabs.create({  
                url: editor_path,
                index: tabs[0].index + 1
            });
        });
	}else if(info.selectionText.includes('bmwusacm.co')){
		editor_path = `https://author.staging.bmwusacm.co/editor.html/content/bmwusa/${info.selectionText.split(".co/")[1]}`
        if(editor_path.match("no-cache")){
            editor_path = editor_path.replace(".no-cache","");
        }
        chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
            chrome.tabs.create({  
                url: editor_path,
                index: tabs[0].index + 1
            });
        });
        
	}
}
chrome.contextMenus.create({
	title: "Open on AEM", 
	contexts:["link"], 
	id: "openOnAem"
});

chrome.contextMenus.onClicked.addListener(openAuthor)