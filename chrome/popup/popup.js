new ClipboardJS('.btn-clip');

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
	evaluateDomain(tabs[0].url);
	evaluateFlags(tabs[0].url);
});

async function evaluateFlags(url){
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { msg: "checkPreorder" }, function (response) {
			if (response.preorder) {
				document.getElementById("btnPreOrderFlag").classList.add("text-success");
			}
		});
		chrome.tabs.sendMessage(tabs[0].id, { msg: "checkmksflag" }, function (response) {
			if (response.mks) {
				document.getElementById("btnMKSflag").classList.add("text-success");
			}
		});
		chrome.tabs.sendMessage(tabs[0].id, { msg: "mainbuttons" }, function (response) {
			if(response.grid) document.getElementById("btnShowGrid").classList.add("active");
			if(response.spacers) document.getElementById("btnShowSpacers").classList.add("active");
			if(response.headers) document.getElementById("btnHeaders").classList.add("active");
			if(response.alt) document.getElementById("btnAlttext").classList.add("active");
			if(response.analytics) document.getElementById("btnAnalytics").classList.add("active");
		});
	});
}

async function evaluateDomain(url){
	existsDomain(url).then((res)=>{
		if(res){
			createPathsV2(url);
		}else if(url.indexOf(".atlassian.net") !== -1){
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
			domainvec.push({d:`${LSdomain.aem}/editor.html/${LSdomain.root}`,n:"author 1"});
			if(LSdomain.aem2 !== "undefined"){
				domainvec.push({d:`${LSdomain.aem2}/editor.html/${LSdomain.root2}`,n:"author 2"});
			}
			let rootPath = ``;
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
								d: `${domain.d}`,
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
			paths_div.classList.add("row");

			for(const path of domainvec1){ // * iterate through the paths
				let urlSplit = url.split(build.d)[1];
				let div_payloads = document.createElement("div");
				div_payloads.classList.add("col-6");
				div_payloads.innerHTML = `
					<div class="mb-2">
						<h6>${path.n}:</h6><br>
						<div class="d-flex jcs a-i-e mt-2">
							<button class="btn-sm-primary me-2" id="openLink-${path.n.replace(/\/|\./g,"")}" data-url="${path.d + urlSplit}"><i class="fas fa-external-link-alt"></i> Open</button>
							<button class="btn-outline-sm-primary me-2 btn-clip" id="clip-${path.n.replace(/\/|\./g,"").replace(' ','-')}" data-clipboard-text="${path.d + urlSplit}"><i class="fas fa-copy"></i> Copy</button>
						</div>
						<small class="text-se mt-2 d-block text-bold">${path.d}</small>
					</div>
					<hr>
				`;
				let linkAddEvent = document.createElement("p");
				linkAddEvent.classList = "link";
				linkAddEvent.innerHTML = `${path.d + urlSplit}`;
				paths_div.appendChild(div_payloads);
				// paths_div.appendChild(linkAddEvent);
				
			}
			document.getElementById("envs").appendChild(paths_div);

			for(const path of domainvec1){
				let openLink = document.getElementById(`openLink-${path.n.replace(/\/|\./g,"")}`);
				let dataURL = openLink.getAttribute("data-url");
				chrome.tabs.query({currentWindow: true,active: true,}, (tabs) => {
					openLink.addEventListener("click", function(){
						chrome.tabs.create({url: dataURL, index: tabs[0].index + 1});
					});
				})
			}
			for(const path of domainvec1){
				tippy(`#clip-${path.n.replace(/\/|\./g,"").replace(' ','-')}`, {
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
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { msg: "toggleGrid" }, function (response) {
			if (response.grid) document.getElementById("btnShowGrid").classList.add("active");
			else document.getElementById("btnShowGrid").classList.remove("active");
		});
	});
});

// ! ------------------------------------------ Show spacers ------------------------------------------
// * READY TO USE
// TODO: Show BMW Spacers
let btnShowSpacers = document.getElementById("btnShowSpacers");
tippy('#btnShowSpacers', {
	content: 'Toggle Spacers',
});
btnShowSpacers.addEventListener("click", async () => {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { msg: "toggleSpacers" }, function (response) {
			if (response.spacers) document.getElementById("btnShowSpacers").classList.add("active");
			else document.getElementById("btnShowSpacers").classList.remove("active");
		});
	});
});

// ! ------------------------------------------ GET HEADERS ------------------------------------------
// * Ready to use
// TODO: Get all headers from the page and show them in popup
let btnHeaders = document.getElementById("btnHeaders");
tippy('#btnHeaders', {
	content: 'Toggle Headers',
});
btnHeaders.addEventListener("click", async () => {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { msg: "showHeaders" }, function (response) {
			if (response.headers) document.getElementById("btnHeaders").classList.add("active");
			else document.getElementById("btnHeaders").classList.remove("active");
		});
	});
});


// ! ------------------------------------------ Analytics Events ------------------------------------------
// * Ready to use
// TODO: Show the analytics events on the current page
let btnAnalytics = document.getElementById("btnAnalytics");
tippy('#btnAnalytics', {
	content: 'Toggle Analytics',
});
btnAnalytics.addEventListener("click", async () => {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { msg: "showAnalytics" }, function (response) {
			if (response.analytics) document.getElementById("btnAnalytics").classList.add("active");
			else document.getElementById("btnAnalytics").classList.remove("active");
		});
	});
});

// ! ------------------------------------------ Show Alt-text ------------------------------------------
// * WIP
// TODO: show alt-text on every image
let btnAlttext = document.getElementById("btnAlttext");
tippy('#btnAlttext', {
	content: 'Toggle Alt-text',
});
btnAlttext.addEventListener("click", async () => {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { msg: "showAltText" }, function (response) {
			if (response.alt) document.getElementById("btnAlttext").classList.add("active");
			else document.getElementById("btnAlttext").classList.remove("active");
		});
	});
});

// ! ------------------------------------------ Get NAME from JIRA ------------------------------------------
// * READY TO USE
// TODO: Build Jira "CONT-ID" + "name" to create Versions or Workflows
let btnJira = document.getElementById("btnJiraC");
tippy('#btnJiraC', {
	content: 'Copied to clipboard',
	trigger: 'click',
	allowHTML: true
});
btnJiraC.addEventListener("click", async () => {
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
	jiraName = jiraName.replace('&', 'and').replace(/\"/g, '');

	
	// * Build an object with the Jira name and copy it to the clipboard
	var input = document.createElement('textarea');
    input.innerHTML = jiraName;
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
}

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
//TODO: reset resize
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

// ! ------------------------------------------ Generate Lorem Ipsum ------------------------------------------
// * READY TO USE
// TODO: Generate Lorem Ipsum

let btnLoremIpsum = document.getElementById("btnLoremIpsum");
tippy('#btnLoremIpsum', {
	content: 'Copied to clipboard',
	trigger: 'click',
	allowHTML: true
});
btnLoremIpsum.addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: createLoremIpsum,
	});
});
function createLoremIpsum(){
	var input = document.createElement('textarea');
	input.innerHTML = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quamut rproin tesque adipisci ligulain tristi odiophas. Auris nas lacusp tur que loremin musetiam erat. Arcuduis nislae metusdo fames luctus ssed magna. Facilis metussed ipsumnam disse hendrer penatib nunc turpis asin bibendu. Uam enim sapiendo lus sque nostra malesu lum lacusp insuspen. Pharetra metussed imperdie bulum iam semnunc quamal. Imperdie ibulum dolordo cursus pellent iquam conubia. Tique posuered magnaqu natis dictumst ipsumma conubia.`;
	document.body.appendChild(input);
	input.select();
	var result = document.execCommand('copy');
	document.body.removeChild(input);
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


// ! ------------------------------------------ Page Data ------------------------------------------
// * Ready to use
// TODO: Show the schemas, and important data of the page
let btnPageData = document.getElementById("btnPageData");
btnPageData.addEventListener("click", async () => {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { msg: "showPageData" }, function (response) {
			if(response.showPageData){
				chrome.storage.sync.set({showPageData: true}, function() {
					btnPageData.classList.add("text-success");
				});
			}else{
				chrome.storage.sync.set({showPageData: false}, function() {
					btnPageData.classList.remove("text-success");
				});
			}
		});
	});
});
// ! ------------------------------------------ Preorder Flag ------------------------------------------
// * WIP, needs to be tested by dev
// TODO: Toggle PreOrder Flag to test preorderpage
let btnPreOrderFlag = document.getElementById("btnPreOrderFlag");

btnPreOrderFlag.addEventListener("click", function () {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { msg: "preorderflag" }, function (response) {
			if(response.preorder){
				chrome.storage.sync.set({preorder: true}, function() {
					btnPreOrderFlag.classList.add("text-success");
				});
			}else{
				chrome.storage.sync.set({preorder: false}, function() {
					btnPreOrderFlag.classList.remove("text-success");
				});
			}
		});
	})
});

// ! ------------------------------------------ MKS Flag ------------------------------------------
// * WIP, needs to be tested by MKS
// TODO: Toggle MKS/QA Flag to test without login any metrics
let btnMKSflag = document.getElementById("btnMKSflag");

btnMKSflag.addEventListener("click", async () => {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { msg: "mksflag" }, function (response) {
			if(response.mks){
				chrome.storage.sync.set({mks: true}, function() {
					btnMKSflag.classList.add("text-success");
				});
			}else{
				chrome.storage.sync.set({mks: false}, function() {
					btnMKSflag.classList.remove("text-success");
				});
			}
		});
	})
});

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

// ! ------------------------------------------ Compare page ------------------------------------------
// * WIP
// TODO: compare current page with another env

let btnCompareEnv = document.getElementById("btnCompareEnv");
btnCompareEnv.addEventListener("click", async () => {
	chrome.tabs.create({
		url: '../compare/compare.html'
	});
});

// ! ------------------------------------------ Get cosy Info ------------------------------------------
// * Ready to use
// TODO: get cosy info from all cosys

let btnCosyInfo = document.getElementById("btnCosyInfo");
btnCosyInfo.addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: toggleCosyInfo,
	});
});

function toggleCosyInfo(){
	Array.from(document.querySelectorAll("img"))
	.filter(e => e.src.includes("https://cache.bmwusa.com/cosy.arox?"))
	.map(e => {
		let datasrc = e.getAttribute("src");
		let paint = datasrc.split("&paint=")[1].split("&")[0];
		let vehicle = datasrc.split("&vehicle=")[1].split("&")[0];
		return ({datasrc: datasrc, paint: paint, vehicle: vehicle});
	})
	.forEach((e,i) =>{
		if(document.getElementById("cosy-info-element-"+i)){
			document.getElementById("cosy-info-element-"+i).remove();
		}else{
			fetch('https://configure.bmwusa.com/UBYOConfigurator/v4/BM/options/'+e.vehicle)
			.then(response => response.json())
			.then(data => {
				let p = data.filter(f => f.code == e.paint)[0];
				let rgb = p.rgbValues;
				p = `${p.name}`;
				let elm = document.createElement("div");
				elm.id = "cosy-info-element-"+i;
				elm.style.margin = "5px auto";
				elm.style.lineHeight = "17px";
				elm.style.maxWidth = "70%";
				elm.style.zIndex = "999999";
				elm.innerHTML = `
				<div style="border-radius:10px; padding:10px; font-size:15px; box-shadow: 0 0 20px -5px rgba(0, 0, 0, 0.5); vertical-align:middle; background-color:rgba(255, 255, 255, 1);color:black;">
					<b style="color:red;">${e.vehicle}</b><br>
					<b style="color: rgb(${rgb[0]},${rgb[1]},${rgb[2]})">${p}</b>
				</div>`;
				document.querySelector("[src='"+e.datasrc+"']").parentNode.appendChild(elm);
			});
		}
	});
}

// ! ------------------------------------------ Show debug Mode DC19 ------------------------------------------
// * WIP
// TODO: show debug mode offers component
let btndc19 = document.getElementById("btndc19");

btndc19.addEventListener("click", async () => {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { msg: "btndc19" }, function (response) {
		});
	});
});

// ! ------------------------------------------ Show JumpLinks ------------------------------------------
// * WIP
// TODO: show debug mode offers component
let btnJumpLinks = document.getElementById("btnJumpLinks");

btnJumpLinks.addEventListener("click", async () => {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { msg: "btnJumpLinks" }, function (response) {
		});
	});
});