chrome.runtime.onInstalled.addListener(() => {
    console.log('Links loaded');
});

// ! ------------------------------------------ Right Click ------------------------------------------
// TODO: 
function openAuthor(info,tab) {
	let editor_path = info.selectionText;
	if(info.selectionText.includes('https://www.bmwusa.com')){
		editor_path = `https://author.staging.bmwusacm.co/editor.html/content/bmwusa/${info.selectionText.split(".com/")[1]}`
        if(editor_path.match("no-cache")){
            editor_path = editor_path.replace(".no-cache","");
        }
        chrome.tabs.create({  
            url: editor_path
        });
	}else{

    }
}
chrome.contextMenus.create({
	title: "Open on AEM", 
	contexts:["link"], 
	id: "openOnAem"
});

chrome.contextMenus.onClicked.addListener(openAuthor)