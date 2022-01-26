chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data.msg == 'toggleGrid') {
        toogleGrid();
    }else if(data.msg == 'toggleSpacers'){
        showSpacers();
    }else if(data.msg == 'showHeaders'){
        showHeaders();
    }else if(data.msg == 'placeholder'){
        ut3PLaceholder();
    }
});
function toogleGrid(){
    document.body.classList.toggle('show-bmw-grid-overlay');
}
function ut3PLaceholder() {
	document.querySelector('[id*="bmw-personalization"]').classList.toggle('active-placeholder')
}
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