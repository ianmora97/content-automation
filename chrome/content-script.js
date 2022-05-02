chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data.msg == 'toggleGrid') {
        toogleGrid();
    }else if(data.msg == 'toggleSpacers'){
        showSpacers();
    }else if(data.msg == 'showHeaders'){
        showHeaders();
    }else if(data.msg == 'jiraTicket'){
        copyJiraTicket();
    }else if(data.msg == 'preorderflag'){
		if (window.localStorage.getItem('preorder_enabled') == null) {
			sendResponse({preorder: true});
			window.localStorage.setItem('preorder_enabled', 'true');
		} else {
			sendResponse({preorder: false});
			window.localStorage.removeItem('preorder_enabled');
		}
	}else if(data.msg == 'checkPreorder'){
		let preorder = window.localStorage.getItem('preorder_enabled') == null ? false : true;
		sendResponse({preorder: preorder});
	}else if(data.msg == 'mksflag'){
		if (window.localStorage.getItem('QATesting') == null) {
			sendResponse({mks: true});
			window.localStorage.setItem('QATesting', 'true');
		} else {
			sendResponse({mks: false});
			window.localStorage.removeItem('QATesting');
		}
	}else if(data.msg == 'checkmksflag'){
		let mks = window.localStorage.getItem('QATesting') == null ? false : true;
		sendResponse({mks: mks});
	}else if(data.msg == 'showPageData'){
		showPageData();
	}
});
function showPageData(){
	var s = document.createElement('script');
	s.src = chrome.runtime.getURL('scriptInjected.js');
	s.onload = function() {
		this.remove();
	};
	(document.body || document.documentElement).appendChild(s);
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
	if(document.getElementById("schema-element") !== null){
		document.getElementsByTagName("body")[0].style.overflow = "auto";
		document.getElementById("schema-element").remove();
	}else {
		let body = document.getElementsByTagName("body");
		let elm = document.createElement("div");
		body[0].style.overflow = "hidden";
		elm.id = "schema-element";
		elm.style.margin = "auto";
		elm.style.color = "black";
		elm.style.backgroundColor = "#1A1A1A";
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
			<div style="display:flex; justify-content:space-between;align-items:stretch;">
				<div id="pagedata-tabs" style="display:flex; justify-content:start;align-items:center;">

				</div>
				<button role="button" style="cursor:pointer;margin:0px; padding:0px; border:none; background-color:#2d2d2d; outline:none; width:30px; height:30px; border-radius:50%;" 
				onclick="document.getElementById('schema-element').remove(); document.getElementsByTagName('body')[0].style.overflow = 'auto';">
					<span style="font-size:20px; color:white;">X</span>
				</button>
			</div>
			<div id="pagedata-container">

			</div>
			
			<style>
				.string { color: green; }
				.number { color: blue; }
				.boolean { color: red; }
				.null { color: magenta; }
				.key { color: white; }
				#pagedata-tabs {
					overflow: hidden;
					width: 100%;
					background-color: transparent;
				}
				#pagedata-tabs div button {
					background-color: #242424;
					color:white;
					font-weight: bold;
					float: left;
					border: none;
					outline: none;
					cursor: pointer;
					padding: 8px 16px;
					transition: 0.3s;
					font-size: 17px;
				}
				#pagedata-tabs div button:hover {
					background-color: #2d2d2d;
				}
				#pagedata-tabs div button.active {
					background-color: #2d2d2d;
				}
				.tabcontent {
					display: none;
					padding: 6px 12px;
					border-top: none;
				}
			</style>
		`;
		body[0].appendChild(elm);

		// get all seo meta data
		let metaDesc = document.querySelector("meta[name='description']");
		let metaTitle = document.querySelector("title");
		let metaKeywords = document.querySelector("meta[name='keywords']");
		let metaCanonical = document.querySelector("link[rel='canonical']");
		let url = window.location.href;

		let button = document.createElement("div");
		button.innerHTML = `<button class="tablinks active" onclick="openTabPageData(event, 'SEO')">SEO</button>`;
		document.getElementById("pagedata-tabs").appendChild(button);

		let container = document.createElement("div");
		container.id = 'SEO';
		container.className = "tabcontent";
		container.style.display = "block";
		container.innerHTML = `
		<div style="overflow-y:scroll; font-weight:500;border-top:1px solid #cacaca; margin-top:5px;padding-top:5px;">
			<div style="display:flex; flex-direction:column;align-items:start; margin-top:50px;">
				<div style="display:flex; align-items:center;border-bottom:1px solid gray; margin-bottom:15px; width:100%; padding-bottom:10px;">
					<p style="margin:0 !important;color:white;font-weight:bold; font-size:22px; min-width:155px;">Title:</p>
					<p style="margin:0 !important;color:white;font-size:20px;">${metaTitle.innerHTML}</p>
				</div>
				<div style="display:flex; align-items:center;border-bottom:1px solid gray; margin-bottom:15px; width:100%; padding-bottom:10px;">
					<p style="margin:0 !important;color:white;font-weight:bold; font-size:22px; min-width:155px;">Description:</p>
					<p style="margin:0 !important;color:white;font-size:20px;">${metaDesc.content}</p>
				</div>
				<div style="display:flex; align-items:center;border-bottom:1px solid gray; margin-bottom:15px; width:100%; padding-bottom:10px;">
					<p style="margin:0 !important;color:white;font-weight:bold; font-size:22px; min-width:155px;">Keywords:</p>
					<p style="margin:0 !important;color:white;font-size:20px;">${metaKeywords.content}</p>
				</div>
				<div style="display:flex; align-items:center;border-bottom:1px solid gray; margin-bottom:15px; width:100%; padding-bottom:10px;">
					<p style="margin:0 !important;color:white;font-weight:bold; font-size:22px; min-width:155px;">URL:</p>
					<p style="margin:0 !important;color:white;font-size:20px;">${url}</p>
				</div>
				<div style="display:flex; align-items:center;border-bottom:1px solid gray; margin-bottom:15px; width:100%; padding-bottom:10px;">
					<p style="margin:0 !important;color:white;font-weight:bold; font-size:22px; min-width:155px;">Canonical:</p>
					<p style="margin:0 !important;color:white;font-size:20px;">${metaCanonical.href}</p>
				</div>
			</div>
		</div>`;
		document.getElementById("pagedata-container").appendChild(container);

		let schemas = Array.from(document.querySelectorAll("[type='application/ld+json']"));
		schemas.forEach(e => {
			let innerText = JSON.parse(e.innerText);
			let button = document.createElement("div");
			button.innerHTML = `<button class="tablinks" onclick="openTabPageData(event, '${innerText['@type']}')">${innerText['@type']}</button>`;
			document.getElementById("pagedata-tabs").appendChild(button);

			let container = document.createElement("div");
			container.id = innerText['@type'];
			container.className = "tabcontent";
			let print = JSON.stringify(innerText,null,4);
			container.innerHTML = `<div style="overflow-y:scroll; white-space: pre-wrap; font-weight:500;color:white; margin-top:5px;padding-top:5px;">${syntaxHighlight(print)}</div>`;
			document.getElementById("pagedata-container").appendChild(container);
		})
		
	}
}

function toogleGrid(){
    document.body.classList.toggle('show-bmw-grid-overlay');
}
function copyJiraTicket() {
	// * Get the title of the current page and refactor it to a Jira name
	let jiraName = document.getElementsByTagName('title')[0].innerText;
	console.log(jiraName);
	jiraName = jiraName.replace('[','').replace(']',' -').replace(/\|/g,'-').split(" - Virtuelle Welt Jira")[0];
	console.log(jiraName);

	// * Build an object with the Jira name and copy it to the clipboard
	var input = document.createElement('textarea');
    input.innerHTML = jiraName;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
}
function showSpacers() {
	console.log("Showing Spacers");
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