new ClipboardJS('.btn-clip');

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
	evaluateDomain(tabs[0].url);
});

async function evaluateDomain(url){
	existsDomain(url).then((res)=>{
		if(res){
			createPathsV2(url);
		}else if(url.indexOf(".atlassian.net") !== -1){
			let btnJira = document.getElementById("btnJira");
			btnJira.disabled = false;
			btnJira.classList.remove("disabled");
	
			let jira = document.createElement("div");
			jira.innerHTML="<p>Jira<p>"
			document.body.appendChild(jira); 
		}
	}).catch((err)=>{
		let unknown = document.createElement("div");
		unknown.innerHTML=`<p>${err}<p>`
		document.body.appendChild(unknown);
	});
}

function existsDomain(url){
	return new Promise((resolve, reject)=>{
		chrome.storage.sync.get("environments", (data) => {
			if(Object.keys(data).length === 0) resolve(false);
			if(data && Object.keys(data).length === 0 && Object.getPrototypeOf(obj) === Object.prototype) reject("No environments found");
			let envs = JSON.parse(data.environments);
			if(url.indexOf("editor.html/") !== -1) resolve(true);
			for(let i = 0; i < envs.length; i++){
				if(url.indexOf(envs[i].envURL) !== -1) resolve(true);
			}
			resolve(false)
		});
	})
}

// TODO: create the links for all paths from local storage
function createPathsV2(url){
	// * create an array with all the environments
	let domainvec = new Array();
	chrome.storage.sync.get("domain", (data1) => {
		chrome.storage.sync.get("environments", (data2) => {
			// * get AEM domain from local storage
			let LSdomain = JSON.parse(data1.domain);
			domainvec.push({d:`${LSdomain.aem}/editor.html/`,n:"/editor.html"});
			let rootPath = `${LSdomain.root}`;
			// * get all environments from local storage
			let envs = JSON.parse(data2.environments);
			if(envs.length === 0 ) return false;
			// * iterate through the environments and add them to the array
			for(let i = 0; i < envs.length; i++){domainvec.push({d: envs[i].envURL,n: envs[i].envName})}
			// * get URL tab and remove the current environment from the array (if it exists)
			let build = domainvec.filter(domain => {if(url.indexOf(domain.d) !== -1)return domain.d})[0];
			console.log(build)
			let domainvec1 = new Array();
			domainvec.forEach(domain => {
				if(url.indexOf(domain.d) === -1){
					if(url.split("/content/launches/")[1] === undefined){ // * is not a launch page
						if(domain.n === "/editor.html"){
							domainvec1.push({
								d: `${domain.d}${rootPath}`,
								n: `${domain.n}`
							});
						}else{
							domainvec1.push({
								d: `${domain.d}`,
								n: `${domain.n}`
							});
						}
					}else{ // * is launch
						domainvec1.push({
							d: `${domain.d}`,
							n: `${domain.n}`
						});
					}
				}
			});
			console.log(domainvec1)
			// * create the container for all paths
			let paths_div = document.createElement("div");
			let p_domain = document.createElement("p");
			p_domain.innerHTML = `You are on <span class="text-se">${build.n}</span>`;
			paths_div.appendChild(p_domain);
			for(const path of domainvec1){ // * iterate through the paths
				let urlSplit = url.split(build.d)[1];
				let div_payloads = document.createElement("div");
				div_payloads.innerHTML = `
					<div class="d-flex jcs a-i-e mb-2">
						<h6>${path.n}:</h6>
						<button class="btn-sm-primary ms-2 btn-clip" id="clip-${path.n.replace(/\/|\./g,"")}" data-clipboard-text="${path.d + urlSplit}"><i class="fas fa-copy"></i> Copy</button>
					</div>
				`;
				let hr = document.createElement("hr");
				let linkAddEvent = document.createElement("p");
				linkAddEvent.classList = "link";
				linkAddEvent.innerHTML = `${path.d + urlSplit}`;
				paths_div.appendChild(div_payloads);
				paths_div.appendChild(linkAddEvent);
				paths_div.appendChild(hr);
				chrome.tabs.query({currentWindow: true,active: true,}, (tabs) => {
					linkAddEvent.addEventListener("click", function(){
						chrome.tabs.create({url: path.d + urlSplit, index: tabs[0].index + 1});
					});
				})
			}
			document.body.appendChild(paths_div);
			for(const path of domainvec1){
				tippy(`#clip-${path.n.replace(/\/|\./g,"")}`, {
					content: `Copied!`,
					trigger: "click",
				});
			}
		});
	});
}

// ! ------------------------------------------- GRID -------------------------------------------------
// * READY TO USE
let btnShowGrid = document.getElementById("btnShowGrid");
tippy('#btnShowGrid', {
	content: 'Toggle Grid',
});
btnShowGrid.addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: function(){
			document.body.classList.toggle('show-bmw-grid-overlay');
		},
	});
});

// ! ------------------------------------------ Resize Window ------------------------------------------
// * READY TO USE
function evalOptions(buttonColors) {
    chrome.storage.sync.get("bp_desktop", (data) => {
		tippy('#btnBPDesktop', {
			content: `<strong>${parseInt(data.bp_desktop)}px</strong>`,
			allowHTML: true,
		});
    });
	chrome.storage.sync.get("bp_tablet", (data) => {
		tippy('#btnBPTablet', {
			content: `<strong>${parseInt(data.bp_tablet)}px</strong>`,
			allowHTML: true
		});
	});
	chrome.storage.sync.get("bp_mobile", (data) => {
		tippy('#btnBPMobile', {
			content: `<strong>${parseInt(data.bp_mobile)}px</strong>`,
			allowHTML: true
		});
	});
}
evalOptions();
//TODO: resize window for desktop
let btnBPDesktop = document.getElementById("btnBPDesktop");
btnBPDesktop.addEventListener("click", async () => {
	chrome.storage.sync.get("bp_desktop", (data) => {
		chrome.windows.getCurrent(function(wind) {
			var maxWidth = parseInt(data.bp_desktop);
			var maxHeight = window.screen.availHeight;
			var updateInfo = {
				width: maxWidth,
				height: maxHeight
			};
			chrome.windows.update(wind.id, updateInfo);
		});
	});
});
//TODO: resize window for tablet
let btnBPTablet = document.getElementById("btnBPTablet");
btnBPTablet.addEventListener("click", async () => {
	chrome.storage.sync.get("bp_tablet", ( data ) => {
		chrome.windows.getCurrent(function(wind) {
			var maxWidth = parseInt(data.bp_tablet);
			var maxHeight = window.screen.availHeight;
			var updateInfo = {
				width: maxWidth,
				height: maxHeight
			};
			chrome.windows.update(wind.id, updateInfo);
		});
	});
});
//TODO: resize window for mobile
let btnBPMobile = document.getElementById("btnBPMobile");
btnBPMobile.addEventListener("click", async () => {
	chrome.storage.sync.get("bp_mobile", ( data ) => {
		chrome.windows.getCurrent(function(wind) {
			var maxWidth = parseInt(data.bp_mobile);
			var maxHeight = window.screen.availHeight;
			var updateInfo = {
				width: maxWidth,
				height: maxHeight
			};
			chrome.windows.update(wind.id, updateInfo);
		});
	});
});
//TODO: Reset window
let btnBPReset = document.getElementById("btnBPReset");
btnBPReset.addEventListener("click", async () => {
	chrome.windows.getCurrent(function(wind) {
		var maxWidth = window.screen.availWidth;
		var maxHeight = window.screen.availHeight;
		var updateInfo = {
			width: maxWidth,
			height: maxHeight
		};
		chrome.windows.update(wind.id, updateInfo);
	});
});
//TODO: resize window custom
let customBPInput = document.getElementById("customBPInput");
customBPInput.addEventListener("keyup", async (event) => {
	if (event.keyCode === 13) {
		chrome.windows.getCurrent(function(wind) {
			var maxWidth = parseInt(customBPInput.value);
			var maxHeight = window.screen.availHeight;
			var updateInfo = {
				width: maxWidth,
				height: maxHeight
			};
			chrome.windows.update(wind.id, updateInfo);
		});
	}
});

// ! ------------------------------------------ Get NAME from JIRA ------------------------------------------
// * READY TO USE
// TODO: Build Jira "CONT-ID" + "name" to create Versions or Workflows
let btnJira = document.getElementById("btnJira");
tippy('#btnJira', {
	content: 'Copied to clipboard',
	trigger: 'click',
	allowHTML: true
});
btnJira.addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: getJiraTitle,
	});
});

function getJiraTitle() {
	// * Get the title of the current page and refactor it to a Jira name
	let jiraName = document.getElementsByTagName('title')[0].innerText;
	jiraName = jiraName.replace('[','').replace(']',' -').replace(/\|/g,'-').split(" - Virtuelle Welt Jira")[0];

	// * Build an object with the Jira name and copy it to the clipboard
	var input = document.createElement('textarea');
    input.innerHTML = jiraName;
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
}

// ! ------------------------------------------ Show spacers ------------------------------------------
// * READY TO USE
// TODO: Show BMW Spacers
let btnShowSpacers = document.getElementById("btnShowSpacers");
tippy('#btnShowSpacers', {
	content: 'Toggle Spacers',
});
btnShowSpacers.addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: showSpacers,
	});
});
function showSpacers() {
	if(document.getElementById("estilos-spacers")){
		document.getElementById("estilos-spacers").remove();
	}else{
		let style = document.createElement('div');
		style.id = "estilos-spacers"
		style.innerHTML = `
			<style>
				.spacer-gnl{height:190px !important;margin-bottom: 0 !important; background-color:rgba(192, 233, 243, 0.95);border-left:5px solid #33A7FF;font-size:1.5rem;}
				.spacer-gnl:before{content:"190px - GNL";display:flex;height:100%;color:black;text-align:center;justify-content:center;text-align: center;}
				.spacer-xx-large{height:120px !important;margin-bottom: 0 !important; background-color:rgba(244, 239, 252, 0.95);border-left:5px solid #AA75FF;font-size:1.5rem;}
				.spacer-x-large{height:100px !important;margin-bottom: 0 !important; background-color:rgba(204, 245, 238, 0.95);border-left:5px solid #95FFED;font-size:1.5rem;}
				.spacer-large{height:80px !important;margin-bottom: 0 !important; background-color:rgba(194, 212, 244, 0.95);border-left:5px solid #6C97E5;font-size:1.5rem;}
				.spacer-medium{height:50px !important;margin-bottom: 0 !important; background-color:rgba(244, 241, 225, 0.95);border-left:5px solid #DCC33E;font-size:1rem;}
				.spacer-small{height:25px !important;margin-bottom: 0 !important; background-color:rgba(223, 251, 223, 0.95);border-left:5px solid #44E03E;font-size:1rem;}
				.spacer-x-small{height:10px !important;margin-bottom: 0 !important; background-color:rgba(243, 246, 206, 0.95);border-left:5px solid #E3F31D;font-size:0.7rem;}
				.spacer-xx-small{height:5px !important;margin-bottom: 0 !important; background-color:rgba(247, 225, 187, 0.95);border-left:5px solid #FFA0A0;font-size:0.6rem;}
			</style>
		`;
		document.body.appendChild(style);
	}
}


// ! ------------------------------------------ GET HEADERS ------------------------------------------
// * Ready to use
// TODO: Get all headers from the page and show them in popup
let btnHeaders = document.getElementById("btnHeaders");
tippy('#btnHeaders', {
	content: 'Toggle Headers',
});
btnHeaders.addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: showHeaders,
	});
});

function showHeaders() {
	let hsTagNames = new Array();
	for (let i = 1; i <= 6; i++) {
		hsTagNames.push(...document.getElementsByTagName('h' + i));
	}
	hsTagNames.forEach((hl,i) => {
		let regexMatch = /(headline|eyebrow|label)/
		let type = null;
		[...hl.classList].forEach(a => {
			type = regexMatch.test(a) ? a : null
		});
		if(type){
			if(document.getElementById("header-element-"+i)){
				document.getElementById("header-element-"+i).remove();
			}else{
				let cords = hl.getBoundingClientRect();
				let elm = document.createElement("div");
				elm.id = "header-element-"+i;
				elm.style.margin = "0px";
				elm.style.lineHeight = "17px";
				elm.style.color = "white";
				elm.style.whiteSpace = "nowrap";
				elm.style.zIndex = "9999";
				elm.innerHTML = `<span style="border-radius:2px; padding:2px; font-size:11px; font-weight:bold; vertical-align:middle; background-color:rgba(255, 0, 0, 0.9);">${hl.tagName} - ${type}</span>`;
				hl.prepend(elm);
			}
		}
	});
}

// ! ------------------------------------------ UT3 Placeholder ------------------------------------------
// * WIP, the UT3 placeholder is not working on Adobe Target
// TODO: Using the same function for the UT3 placeholder
let btnUT3 = document.getElementById("btnUT3");
btnUT3.addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: ut3PLaceholder,
	});
});
function ut3PLaceholder() {
	document.querySelector('[id*="bmw-personalization"]').classList.toggle('active-placeholder')
}



// ! ------------------------------------------ Schema ------------------------------------------
// * Ready to use
// TODO: Show the schema of the page
let btnSchema = document.getElementById("btnSchema");
btnSchema.addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: showSchema,
	});
});
function showSchema() {
	function syntaxHighlight(json) {
		json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
			var cls = 'number';
			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					cls = 'key';
				} else {
					cls = 'string';
				}
			} else if (/true|false/.test(match)) {
				cls = 'boolean';
			} else if (/null/.test(match)) {
				cls = 'null';
			}
			return '<span class="' + cls + '">' + match + '</span>';
		});
	}
	let text = "";
	document.querySelectorAll("[type='application/ld+json']").forEach(e => {
		let json1 = JSON.parse(e.innerText);
		if(json1['@type'] == "Car"){
			if(document.getElementById("schema-element") !== null){
				document.getElementsByTagName("body")[0].style.overflow = "auto";
				document.getElementById("schema-element").remove();
			}else {
				let print = JSON.stringify(json1,null,4);
				let body = document.getElementsByTagName("body");
				let elm = document.createElement("div");
				body[0].style.overflow = "hidden";
				elm.id = "schema-element";
				elm.style.margin = "auto";
				elm.style.color = "black";
				elm.style.backgroundColor = "white";
				elm.style.padding = "18px";
				elm.style.borderRadius = "5px";
				elm.style.zIndex = "9999";
				elm.style.position = "fixed";
				elm.style.top = "2%";
				elm.style.left = "2%";
				elm.style.width = "96%";
				elm.style.height = "96%";
				elm.style.overflow = "auto";
				elm.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.5)";
				elm.innerHTML = `
					<div style="display:flex; justify-content:space-between;align-items-center;">
						<h4 style="margin:0px;">Schema</h4>
						<button role="button" style="cursor:pointer;margin:0px; padding:0px; border:none; background-color:white; outline:none; width:30px; height:30px; border-radius:50%;" onclick="document.getElementById('schema-element').remove(); document.getElementsByTagName('body')[0].style.overflow = 'auto';">
							<img style="width:25px; height:25px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABDElEQVRoge3ZXQqCQBSG4a8WUdIWbbmBtRq70A8kxBw9fzOc96oukvOg6QwCWZZlLdUD6LyHwDRDf/THTwAjgAG+mG6eYZxnKu4G4DUf4APgITba/u6LGd5nZvDEiCGYB0YcwSwxaghmgVFHME2MGYJpYMwRTBLjhmASGHcEO4MJg2BHMOEQrAQTFsH2YMIj2BamGgRbw1SHYMs9xPDzOcJGrajlmVE/E1etAwO4/PleRU1cWmt/7Ajb5qK27k7VYPbcYsNjSp4TYTFHHnbhMGee2GEwEssOd4zk2skNo7EANMdormLNMBZLcXWM5X5CDeOxKRLHeO7sxDARtqcimGZevQGNvAzNsiyL1xcbE8X3wv0coQAAAABJRU5ErkJggg=="/>
						</button>
					</div>
					<div style="overflow-y:scroll; white-space: pre-wrap; font-weight:500;border-top:1px solid #cacaca; margin-top:5px;padding-top:5px;">${syntaxHighlight(print)}</div>
					<style>
						.string { color: green; }
						.number { color: blue; }
						.boolean { color: red; }
						.null { color: magenta; }
						.key { color: black; }
					</style>
				`;
				body[0].appendChild(elm);
			}
		}
	})
}

// ! ------------------------------------------ List Items ------------------------------------------
// * WIP, needs to be tested by MKS
// TODO: Toggle MKS/QA Flag to test without login any metrics
let btnMKSflag = document.getElementById("btnMKSflag");
chrome.storage.sync.get(['MKS_QA_Flag'], function(value) {
	if(value.MKS_QA_Flag){
		btnMKSflag.classList.add("active")
	}
});

btnMKSflag.addEventListener("click", async () => {
	chrome.storage.sync.get(['MKS_QA_Flag'], function(value) {
		if(value.MKS_QA_Flag == true){
			chrome.storage.sync.set({MKS_QA_Flag: false}, function() {
				btnMKSflag.classList.remove("active");
				chrome.action.setBadgeText({text: ""});
			});
		}else{
			chrome.storage.sync.set({MKS_QA_Flag: true}, function() {
				btnMKSflag.classList.add("active");
				chrome.action.setBadgeText({text: "1"});
			});
		}
	});
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: toggleQATesting,
	});
});
function toggleQATesting() {
	let body = document.getElementsByTagName("body")[0];
	if (window.localStorage.getItem('QATesting') == null) {
		let elm = document.createElement("div");
		elm.id = "QATesting";
		elm.className = "fadein";
		elm.style.position = "fixed";
		elm.style.top = "2%";
		elm.style.left = "40%";
		elm.style.width = "20%";
		elm.style.textAlign = "center";
		elm.style.backgroundColor = "#c2ffc4";
		elm.style.borderRadius = "5px";
		elm.style.zIndex = "9999";
		elm.style.padding = "18px";
		elm.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.5)";
		elm.innerHTML = `
			<div style="display:flex; justify-content:center;align-items:center;">
				<h6 style="margin:0px;">&#9989; QATesting Flag is ON</h6>
			</div>
			<style>
				@keyframes fadein {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				.fadein {
					animation-name: fadein;
					animation-duration: 1s;
				}
			</style>
		`;
		body.appendChild(elm);
		window.localStorage.setItem('QATesting', true);
		setTimeout(() => {
			document.getElementById("QATesting").remove();
		}, 3000);
	}else{
		let b = document.getElementById("QATesting");
		if(b){
			b.remove();
		}
		let elm = document.createElement("div");
		elm.id = "QATesting";
		elm.className = "fadein";
		elm.style.position = "fixed";
		elm.style.top = "2%";
		elm.style.left = "40%";
		elm.style.width = "20%";
		elm.style.textAlign = "center";
		elm.style.backgroundColor = "#ffe2ad";
		elm.style.borderRadius = "5px";
		elm.style.zIndex = "9999";
		elm.style.padding = "18px";
		elm.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.5)";
		elm.innerHTML = `
			<div style="display:flex; justify-content:center;align-items:center;">
				<h6 style="margin:0px;">&#11093; QATesting Flag is OFF</h6>
			</div>
			<style>
				@keyframes fadein {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				.fadein {
					animation-name: fadein;
					animation-duration: 1s;
				}
			</style>
		`;
		body.appendChild(elm);
		window.localStorage.removeItem('QATesting');
		setTimeout(() => {
			document.getElementById("QATesting").remove();
		}, 3000);
	}
}

// ! ------------------------------------------ Templates ------------------------------------------
// * WIP
// TODO: Show all templates used on the current page
let btnTemplates = document.getElementById("btnTemplates");

btnTemplates.addEventListener("click", async () => {
	// chrome.storage.sync.get(['TEMPLATES'], function(value) {
	// 	if(value.TEMPLATES == true){
	// 		chrome.storage.sync.set({TEMPLATES: false}, function() {
	// 			btnTemplates.classList.remove("active");
	// 			chrome.action.setBadgeText({text: ""});
	// 		});
	// 	}else{
	// 		chrome.storage.sync.set({TEMPLATES: true}, function() {
	// 			btnTemplates.classList.add("active");
	// 			chrome.action.setBadgeText({text: "1"});
	// 		});
	// 	}
	// });
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: toggleTemplates,
	});
});
function toggleTemplates() {
	let elem = document.createElement("div");
	elem.id = "TemplatesStyle";
	elem.innerHTML = `
		<style>
			.showBlueLines{
				border: 5px solid blue;
			}
		</style>
	`;
	document.body.appendChild(elem);
	Array.from(document.getElementsByClassName("template-container")).forEach(e =>{
		e.classList.toggle("showBlueLines");
	})
}