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
	if(document.getElementById("estilos-spacers")){
		document.getElementById("estilos-spacers").remove();
	}else{
		let style = document.createElement('div');
		style.id = "estilos-spacers"
		style.innerHTML = `
			<style>
				.spacer-gnl{height:190px !important;margin-bottom: 0 !important; background-color:rgba(192, 233, 243, 0.95);border-left:5px solid #33A7FF;font-size:1.5rem;}
				.spacer-gnl::before{content:"";display:block;height:100%;width:5px;background-color:rgba(192, 233, 243, 0.95);}
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