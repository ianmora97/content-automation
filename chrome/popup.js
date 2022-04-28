new ClipboardJS('.btn-clip');

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
	evaluateDomain(tabs[0].url);
});

async function evaluateDomain(url){
	existsDomain(url).then((res)=>{
		if(res){
			createPathsV2(url);
		}else if(url.indexOf(".atlassian.net") !== -1){
			// let btnJira = document.getElementById("btnJira");
			// btnJira.disabled = false;
			// btnJira.classList.remove("disabled");
	
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
			domainvec.push({d:`${LSdomain.aem}/editor.html/`,n:"/editor.html 1"});
			domainvec.push({d:`${LSdomain.aem2}/editor.html/`,n:"/editor.html 2"});
			let rootPath = `${LSdomain.root}`;
			// * get all environments from local storage
			let envs = JSON.parse(data2.environments);
			if(envs.length === 0 ) return false;
			// * iterate through the environments and add them to the array
			for(let i = 0; i < envs.length; i++){domainvec.push({d: envs[i].envURL,n: envs[i].envName})}
			// * get URL tab and remove the current environment from the array (if it exists)
			let build = domainvec.filter(domain => {if(url.indexOf(domain.d) !== -1)return domain.d})[0];
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

// ! ------------------------------------------ Get NAME from JIRA ------------------------------------------
// * READY TO USE
// TODO: Build Jira "CONT-ID" + "name" to create Versions or Workflows
// let btnJira = document.getElementById("btnJira");
// tippy('#btnJira', {
// 	content: 'Copied to clipboard',
// 	trigger: 'click',
// 	allowHTML: true
// });
// btnJira.addEventListener("click", async () => {
// 	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
// 	chrome.scripting.executeScript({
// 		target: { tabId: tab.id },
// 		function: getJiraTitle,
// 	});
// });

// function getJiraTitle() {
// 	// * Get the title of the current page and refactor it to a Jira name
// 	let jiraName = document.getElementsByTagName('title')[0].innerText;
// 	jiraName = jiraName.replace('[','').replace(']',' -').replace(/\|/g,'-').split(" - Virtuelle Welt Jira")[0];

// 	// * Build an object with the Jira name and copy it to the clipboard
// 	var input = document.createElement('textarea');
//     input.innerHTML = jiraName;
//     document.body.appendChild(input);
//     input.select();
//     var result = document.execCommand('copy');
//     document.body.removeChild(input);
//     return result;
// }

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
	// * get viewport width
	let viewport = window.screen.availWidth;

	// * set breakpoint for spacers
	let bp = {};
	if(viewport < 768){bp = {n:"mobile",ex:"spacer-exclude-mobile"}}
	if(viewport >= 768 && viewport < 1280){bp = {n:"tablet",ex:"spacer-exclude-tablet"}}
	if(viewport >= 1280 && viewport < 2000){bp = {n:"desktop",ex:"spacer-exclude-desktop"}}
	if(viewport >= 2000){bp = {n:"desktop-large",ex:"spacer-exclude-desktop-large"}}

	// * set spacers styles
	let spacersArray = [
		{"spacer-gnl":{height:"190px",heightS:"160px",bg:"192, 233, 243, 0.95",border:"#33A7FF",fs:"1.5rem"}},
		{"spacer-xx-large":{height:"120px",heightS:"100px",bg:"244, 239, 252, 0.95",border:"#AA75FF",fs:"1.5rem"}},
		{"spacer-x-large":{height:"100px",heightS:"90px",bg:"204, 245, 238, 0.95",border:"#95FFED",fs:"1.5rem"}},
		{"spacer-large":{height:"80px",heightS:"60px",bg:"194, 212, 244, 0.95",border:"#6C97E5",fs:"1.5rem"}},
		{"spacer-medium":{height:"50px",heightS:"40px",bg:"244, 241, 225, 0.95",border:"#DCC33E",fs:"1rem"}},
		{"spacer-small":{height:"25px",heightS:"20px",bg:"223, 251, 223, 0.95",border:"#44E03E",fs:"1rem"}},
		{"spacer-x-small":{height:"10px",heightS:"10px",bg:"243, 246, 206, 0.95",border:"#E3F31D",fs:"0.7rem"}},
		{"spacer-xx-small":{height:"5px",heightS:"5px",bg:"247, 225, 187, 0.95",border:"#FFA0A0",fs:"0.6rem"}}
	];
	
	// * toggle spacers
	spacersArray.forEach(spacer => {
		let dom = [...document.getElementsByClassName(`${Object.keys(spacer)[0]}`)];
		dom.filter(spacerDOM => {
			return !spacerDOM.classList.contains(`${bp.ex}`);
		}).forEach(spacerDOM => { 
			if(spacerDOM.style.backgroundColor == `rgba(${spacer[Object.keys(spacer)[0]].bg})`){
				spacerDOM.style.backgroundColor = null;
				spacerDOM.style.height = null;
				spacerDOM.style.marginBottom = null;
				spacerDOM.style.borderLeft = null;
				spacerDOM.style.display = null;
				spacerDOM.style.justifyContent = null;
				spacerDOM.style.alignItems = null;
				spacerDOM.innerHTML = "";
			}else{
				spacerDOM.style.backgroundColor = `rgba(${spacer[Object.keys(spacer)[0]].bg})`;
				spacerDOM.style.borderLeft = `5px solid ${spacer[Object.keys(spacer)[0]].border}`;
				if(bp.n == "mobile" || bp.n == "tablet"){
					spacerDOM.style.height = `${spacer[Object.keys(spacer)[0]].heightS}`;
				}else{
					spacerDOM.style.height = `${spacer[Object.keys(spacer)[0]].height}`;
				}
				spacerDOM.style.marginBottom = "0px";
				spacerDOM.style.display = "flex";
				spacerDOM.style.justifyContent = "center";
				spacerDOM.style.alignItems = "center";
				spacerDOM.innerHTML = `<span class="h-center" style="font-weight:bold;font-size:calc(${spacer[Object.keys(spacer)[0]].fs} - 4px);display:block;">${spacer[Object.keys(spacer)[0]].height} - ${Object.keys(spacer)[0].split("spacer-")[1]}</span>`
			}
		});
	});
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
				elm.innerHTML = `<span style="border-radius:2px; padding:2px; font-size:13px; font-weight:bold; vertical-align:middle; background-color:rgba(255, 0, 0, 0.9);">${hl.tagName} - ${type}</span>`;
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

btnMKSflag.addEventListener("click", async () => {
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
// * Ready to use
// TODO: Show all templates used on the current page
let btnTemplates = document.getElementById("btnTemplates");

btnTemplates.addEventListener("click", async () => {
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

// ! ------------------------------------------ Analytics Events ------------------------------------------
// * WIP
// TODO: Show the analytics events on the current page
let btnAnalytics = document.getElementById("btnAnalytics");

btnAnalytics.addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: showAnalytics,
	});
});
function showAnalytics() {
	Array.from(document.querySelectorAll("[analytics-event]")).forEach((e,i) =>{
		if(document.getElementById("event-element-"+i)){
			document.getElementById("event-element-"+i).remove();
		}else{
			let elm = document.createElement("div");
			elm.id = "event-element-"+i;
			elm.style.margin = "0px";
			elm.style.lineHeight = "17px";
			elm.style.color = "white";
			elm.style.whiteSpace = "nowrap";
			elm.style.zIndex = "9999";
			elm.innerHTML = `<span style="border-radius:2px; padding:2px; font-size:13px; font-weight:bold; vertical-align:middle; background-color:rgba(255, 0, 0, 0.9);">${e.getAttribute("analytics-event")}</span>`;
			e.prepend(elm);
		}
	});
}