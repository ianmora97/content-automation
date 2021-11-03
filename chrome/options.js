// * input elements on the options page for breakpoints
var bpDesktop = document.getElementById("bpDesktop");
var bpTablet = document.getElementById("bpTablet");
var bpMobile = document.getElementById("bpMobile");
var aemDomainInput = document.getElementById("aemDomainInput");
var aemRootInput = document.getElementById("aemRootInput");

var btnSaveBP = document.getElementById("btnSaveBP");
btnSaveBP.addEventListener("click", handleButtonClickBP);

var btnSaveAem = document.getElementById("btnSaveAem");
btnSaveAem.addEventListener("click", handleButtonClickDomain);

var addEnvBtn = document.getElementById("addEnvBtn");
addEnvBtn.addEventListener("click", handleAddEnvBtn);

var envListItems = new Map();
var contEnvListItems = 0;
function handleAddEnvBtn(event){
	contEnvListItems++;
	envListItems.set(contEnvListItems,{
		envURL: "",
		envName: ""
	})
	$("#envsInputs").append(`
		<div class="input-group mb-2 a-i-c" id="inputGroup-${contEnvListItems}">
			<span><i class="fas fa-circle text-pr me-2"></i></span>
			<input type="text" style="width:300px;" class="form-control me-2" placeholder="URL..." id="envURL-input-${contEnvListItems}" data-id="${contEnvListItems}">
			<input type="text" style="width:180px;" class="form-control" placeholder="Name..." id="envName-input-${contEnvListItems}" data-id="${contEnvListItems}">
			<button class="btn-transparent ms-2" id="inputGroupRemove-${contEnvListItems}" data-id="${contEnvListItems}">
				<i class="fas fa-minus-square text-danger" style="font-size:18px;"></i>
			</button>
		</div>
	`);
	$(`#inputGroupRemove-${contEnvListItems}`).on("click", function(event){
		$(`#inputGroup-${$(this).data("id")}`).remove();
		envListItems.delete(parseInt($(this).data("id")));
	});
	$(`#envURL-input-${contEnvListItems}`).on("keyup", function(event){
		let id = $(this).data("id")
		envListItems.set(id,{
			envURL: $(this).val(),
			envName: $(`#envName-input-${id}`).val()
		});
	});
	$(`#envName-input-${contEnvListItems}`).on("keyup", function(event){
		let id = $(this).data("id")
		envListItems.set(id,{
			envURL: $(`#envURL-input-${id}`).val(),
			envName: $(this).val()
		});
	});
}

function handleButtonClickBP(event) {
	let bp_desktop = bpDesktop.value;
	let bp_tablet = bpTablet.value;
	let bp_mobile = bpMobile.value;
  	chrome.storage.sync.set({ bp_desktop });
  	chrome.storage.sync.set({ bp_tablet });
  	chrome.storage.sync.set({ bp_mobile });
	$("#fbText").html("Breakpoints saved")
	$("#feedback").fadeIn('slow').animate({opacity: 1.0}, 1500).fadeOut('slow'); 
	
}
function handleButtonClickDomain(event) {
	let domain = {
		aem: aemDomainInput.value,
		root: aemRootInput.value
	}
	domain = JSON.stringify(domain);
	chrome.storage.sync.set({ domain });

	let array = new Array();
	envListItems.forEach(function(value, key){
		array.push(value);
	});
	let environments = JSON.stringify(array);
	chrome.storage.sync.set({ environments });

	$("#fbText").html("AEM Domain and environments Saved")
	$("#feedback").fadeIn('slow').animate({opacity: 1.0}, 1500).fadeOut('slow'); 
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
	chrome.storage.sync.get("domain", (data) => {
		let domain = JSON.parse(data.domain);
		aemDomainInput.value = domain.aem;
		aemRootInput.value = domain.root;
	});
	chrome.storage.sync.get("environments", (data) => {
		let environments = JSON.parse(data.environments);
		buildEnvsInputs(environments);
	});
}

function buildEnvsInputs(envs) {
	for(let i = 0; i < envs.length; i++){
		contEnvListItems++;
		envListItems.set(contEnvListItems,{
			envURL: envs[i].envURL,
			envName: envs[i].envName
		})
		$("#envsInputs").append(`
		<div class="input-group mb-2 a-i-c" id="inputGroup-${contEnvListItems}">
			<span><i class="fas fa-circle text-pr me-2"></i></span>
			<input type="text" style="width:300px;" class="form-control me-2" value="${envs[i].envURL}" placeholder="URL..." id="envURL-input-${contEnvListItems}" data-id="${contEnvListItems}">
			<input type="text" style="width:180px;" class="form-control" value="${envs[i].envName}" placeholder="Name..." id="envName-input-${contEnvListItems}" data-id="${contEnvListItems}">
			<button class="btn-transparent ms-2" id="inputGroupRemove-${contEnvListItems}" data-id="${contEnvListItems}">
				<i class="fas fa-minus-square text-danger" style="font-size:18px;"></i>
			</button>
		</div>
		`);
		$(`#inputGroupRemove-${contEnvListItems}`).on("click", function(event){
			$(`#inputGroup-${$(this).data("id")}`).remove();
			envListItems.delete(parseInt($(this).data("id")));
		});
		$(`#envURL-input-${contEnvListItems}`).on("keyup", function(event){
			let id = $(this).data("id")
			envListItems.set(id,{
				envURL: $(this).val(),
				envName: $(`#envName-input-${id}`).val()
			});
		});
		$(`#envName-input-${contEnvListItems}`).on("keyup", function(event){
			let id = $(this).data("id")
			envListItems.set(id,{
				envURL: $(`#envURL-input-${id}`).val(),
				envName: $(this).val()
			});
		});
	}
}

evalOptions();
