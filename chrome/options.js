// * input elements on the options page for breakpoints
var bpDesktop = document.getElementById("bpDesktop");
var bpTablet = document.getElementById("bpTablet");
var bpMobile = document.getElementById("bpMobile");

var btnSaveBP = document.getElementById("btnSaveBP");
btnSaveBP.addEventListener("click", handleButtonClick);

function handleButtonClick(event) {
	let bp_desktop = bpDesktop.value;
	let bp_tablet = bpTablet.value;
	let bp_mobile = bpMobile.value;
  	chrome.storage.sync.set({ bp_desktop });
  	chrome.storage.sync.set({ bp_tablet });
  	chrome.storage.sync.set({ bp_mobile });
}


function evalOptions(buttonColors) {
    chrome.storage.sync.get("bp_desktop", (data) => {
        bpDesktop.value = data.bp_desktop;
    });
	chrome.storage.sync.get("bp_tablet", (data) => {
		bpTablet.value = data.bp_tablet;
	});
	chrome.storage.sync.get("bp_mobile", (data) => {
		bpMobile.value = data.bp_mobile;
	});
}

evalOptions();
