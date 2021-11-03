
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
	evaluateDomain(tabs[0].url);
});

async function evaluateDomain(url){
	existsDomain(url).then((res)=>{
		if(res){ // * If res is true, the domain exists in the local storage
			createPathsV2(url);
		}else if(url.indexOf(".atlassian.net") !== -1){ // * If res is false, the domain does not exist in the local storage and the url is from Jira
			let btnJira = document.getElementById("btnJira");
			btnJira.disabled = false;
			btnJira.classList.remove("disabled");
	
			let jira = document.createElement("div");
			jira.innerHTML="<p>Jira<p>"
			document.body.appendChild(jira); 
		}
	}).catch((err)=>{ // * If throws an error domain is not recognized
		let unknown = document.createElement("div");
		unknown.innerHTML=`<p>${err}<p>`
		document.body.appendChild(unknown);
	});
}

function existsDomain(url){
	return new Promise((resolve, reject)=>{
		chrome.storage.sync.get("environments", (data) => {
			if(Object.keys(data).length === 0) resolve(false);
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
			domainvec.push({d:`${LSdomain.aem}/editor.html${LSdomain.root}`,n:"/editor.html"});
			// * get all environments from local storage
			let envs = JSON.parse(data2.environments);
			if(envs.length === 0 ) return false;
			// * iterate through the environments and add them to the array
			for(let i = 0; i < envs.length; i++){domainvec.push({d: envs[i].envURL,n: envs[i].envName})}
			// * get URL tab and remove the current environment from the array (if it exists)
			let build = domainvec.filter(domain => {if(url.indexOf(domain.d) !== -1)return domain.d})[0];
			domainvec = domainvec.filter(domain => {if(url.indexOf(domain.d) === -1)return domain.d});
			// * create the container for all paths
			let paths_div = document.createElement("div");
			let p_domain = document.createElement("p");
			p_domain.innerHTML = `You are on <span class="text-se">${build.n}</span>`;
			paths_div.appendChild(p_domain);
			for(const path of domainvec){ // * iterate through the paths
				let urlSplit = url.split(build.d)[1];
				let div_payloads = document.createElement("div");
				div_payloads.innerHTML = `<h6>${path.n}: </h6> <br> <a href="${path.d + urlSplit}" target:"_blank">${path.d + urlSplit}</a> <hr>`;
				paths_div.appendChild(div_payloads);	
				div_payloads.addEventListener("click", function(){chrome.tabs.create({url: path.d + urlSplit})}); // * add EventListner to open urls in a new tab
			}
			document.body.appendChild(paths_div);
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
// TODO: WIP
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
				spacerDOM.style.backgroundColor = "rgb(0, 0, 0)";
				spacerDOM.style.height = "0px";
				spacerDOM.style.marginBottom = null;
				spacerDOM.style.borderLeft = "0px solid rgba(0, 0, 0, 0)";
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
				spacerDOM.innerHTML = `<span class="h-center" style="font-weight:bold;font-size:${spacer[Object.keys(spacer)[0]].fs};display:block;">${spacer[Object.keys(spacer)[0]].height} - ${Object.keys(spacer)[0].split("spacer-")[1]}</span>`
			}
		});
	});
}


// ! ------------------------------------------ Get Images ------------------------------------------
// * WIP
// TODO: Get all images from the page and show them on AEM properties
// let btnImages = document.getElementById("btnImages");

// btnImages.addEventListener("click", async () => {
// 	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
// 	chrome.scripting.executeScript({
// 		target: { tabId: tab.id },
// 		function: showImages,
// 	});
// });

// function showImages() {
// 	window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
// 	setTimeout(() => {
// 		let imgsTagName = [...document.getElementsByTagName('img')];
// 		let imgsTagArray = new Array();
// 		imgsTagArray = imgsTagName.filter(img =>{
// 			if(img.src.indexOf(".html") === -1){
// 				if(img.src.indexOf("cosy") === -1){
// 					if(img.src.indexOf("nav") === -1){
// 						return img.src;
// 					}
// 				}
// 			}
// 		}).forEach(img => {
// 			console.log(img.src)
// 		});
// 		window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
// 	}, 1500);

// 	let images = document.getElementsByTagName('picture')
// 	let imagesEval = new Array();
//     for(let i = 0; i < images.length; i++){
// 		let imgJQ = images[i].getElementsByTagName('source');
// 		if(imgJQ.length > 0){
// 			// console.log(imgJQ[0].getAttribute('srcset'))
// 		}
//     }
// }