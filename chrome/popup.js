
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
	/*
		TODO: if the current tab is the editor
	*/
	if(tabs[0].url.match("/editor.html")){ 
		let domain = document.createElement("p");
		domain.innerHTML = `You are right now on <span class="text-se">/editor.html</span>`;
		document.body.appendChild(domain);

		// ! ------------------------------------------ Create STAGING path ------------------------------------------
		let stg_path = `https://www.staging.bmwusacm.co${tabs[0].url.split("/editor.html/content/bmwusa")[1]}`;

		let stg = document.createElement("div");
		stg.innerHTML="<h4>Staging: </h4> <br>"+`<a href="${stg_path}" target:"_blank">${stg_path}</a> <hr>`;
		document.body.appendChild(stg);

		stg.addEventListener("click", function(){
			chrome.tabs.create({ url: stg_path });
		});

		// ! ------------------------------------------ Create PROD path ------------------------------------------
		let prod_path = `https://www.prod.bmwusacm.co${tabs[0].url.split("/editor.html/content/bmwusa")[1]}`;

		let prod = document.createElement("div");
		prod.innerHTML="<h4>Prod: </h4> <br>"+`<a href="${prod_path}" target:"_blank">${prod_path}</a> <hr>`;
		document.body.appendChild(prod);

		prod.addEventListener("click", function(){
			chrome.tabs.create({ url: prod_path });
		});

		// ! ------------------------------------------ Create LIVE path ------------------------------------------
		let live_path = `https://www.bmwusa.com${tabs[0].url.split("/editor.html/content/bmwusa")[1]}`;

		let live = document.createElement("div");
		live.innerHTML="<h4>Live: </h4> <br>"+`<a href="${live_path}" target:"_blank">${live_path}</a>`;
		document.body.appendChild(live);

		live.addEventListener("click", function(){
			chrome.tabs.create({ url: live_path });
		});
		
	}
	/*
		TODO: if the current tab is the staging
	*/
	else if(tabs[0].url.match("www.staging.bmwusacm")){
		let domain = document.createElement("p");
		domain.innerHTML = `You are right now on <span class="text-se">staging</span>`;
		document.body.appendChild(domain);

		// ! ------------------------------------------ Create editor path ------------------------------------------
		let editor_path = `https://author.staging.bmwusacm.co/editor.html/content/bmwusa/${tabs[0].url.split(".co/")[1]}`
		if(editor_path.match("no-cache")){
			editor_path = editor_path.replace(".no-cache","");
		}
		let editor = document.createElement("div");
		editor.innerHTML="<h4>AEM Editor: </h4> <br>"+`<a target:"_blank" href="${editor_path}">${editor_path}</a> <hr>`;
		document.body.appendChild(editor);

		editor.addEventListener("click", function(){
			chrome.tabs.create({ url: editor_path });
		});
		
		// ! ------------------------------------------ Create PRDO path ------------------------------------------
		let prod_path = `https://www.prod.bmwusacm.co/${tabs[0].url.split(".co/")[1]}`
		if(prod_path.match("no-cache")){
			prod_path = prod_path.replace(".no-cache","");
		}
		let prod = document.createElement("div");
		prod.innerHTML="<h4>Prod: </h4> <br>"+`<a target:"_blank" href="${prod_path}">${prod_path}</a> <hr>`;
		document.body.appendChild(prod);

		prod.addEventListener("click", function(){
			chrome.tabs.create({ url: prod_path });
		});
		
		// ! ------------------------------------------ Create LIVE path ------------------------------------------
		let live_path = `https://www.bmwusa.com/${tabs[0].url.split(".co/")[1]}`
		if(live_path.match("no-cache")){
			live_path = live_path.replace(".no-cache","");
		}
		let live = document.createElement("div");
		live.innerHTML="<h4>Live: </h4> <br>"+`<a target:"_blank" href="${live_path}">${live_path}</a>`;
		document.body.appendChild(live);

		live.addEventListener("click", function(){
			chrome.tabs.create({ url: live_path });
		});
	}
	/*
		TODO: if the current tab is the live
	*/
	else if(tabs[0].url.match("www.bmwusa.com")){
		let domain = document.createElement("p");
		domain.innerHTML = `You are right now on <span class="text-se">live</span>`;
		document.body.appendChild(domain);

		// ! ------------------------------------------ Create editor path ------------------------------------------
		let editor_path = `https://author.staging.bmwusacm.co/editor.html/content/bmwusa/${tabs[0].url.split(".com/")[1]}`
		if(editor_path.match("no-cache")){
			editor_path = editor_path.replace(".no-cache","");
		}
		let editor = document.createElement("div");
		editor.innerHTML="<h4>AEM Editor: </h4> <br>"+`<a target:"_blank" href="${editor_path}">${editor_path}</a> <hr>`;
		document.body.appendChild(editor);

		editor.addEventListener("click", function(){
			chrome.tabs.create({ url: editor_path });
		});
		
		// ! ------------------------------------------ Create PRDO path ------------------------------------------
		let prod_path = `https://www.prod.bmwusacm.co/${tabs[0].url.split(".com/")[1]}`
		if(prod_path.match("no-cache")){
			prod_path = prod_path.replace(".no-cache","");
		}
		let prod = document.createElement("div");
		prod.innerHTML="<h4>Prod: </h4> <br>"+`<a target:"_blank" href="${prod_path}">${prod_path}</a> <hr>`;
		document.body.appendChild(prod);

		prod.addEventListener("click", function(){
			chrome.tabs.create({ url: prod_path });
		});
		
		// ! ------------------------------------------ Create STAGING path ------------------------------------------
		let stg_path = `https://www.staging.bmwusacm.co/${tabs[0].url.split(".com/")[1]}`
		if(stg_path.match("no-cache")){
			stg_path = stg_path.replace(".no-cache","");
		}
		let live = document.createElement("div");
		live.innerHTML="<h4>Staging: </h4> <br>"+`<a target:"_blank" href="${stg_path}">${stg_path}</a>`;
		document.body.appendChild(live);

		live.addEventListener("click", function(){
			chrome.tabs.create({ url: stg_path });
		});
	}
	/*
		TODO: if the current tab is the prod
	*/
	else if(tabs[0].url.match("www.prod.bmwusacm.co")){
		let domain = document.createElement("p");
		domain.innerHTML = `You are right now on <span class="text-se">prod</span>`;
		document.body.appendChild(domain);

		// ! ------------------------------------------ Create editor path ------------------------------------------
		let editor_path = `https://author.staging.bmwusacm.co/editor.html/content/bmwusa/${tabs[0].url.split(".co/")[1]}`
		if(editor_path.match("no-cache")){
			editor_path = editor_path.replace(".no-cache","");
		}
		let editor = document.createElement("div");
		editor.innerHTML="<h4>AEM Editor: </h4> <br>"+`<a target:"_blank" href="${editor_path}">${editor_path}</a> <hr>`;
		document.body.appendChild(editor);

		editor.addEventListener("click", function(){
			chrome.tabs.create({ url: editor_path });
		});
		
		// ! ------------------------------------------ Create STG path ------------------------------------------
		let staging_path = `https://www.staging.bmwusacm.co/${tabs[0].url.split(".co/")[1]}`
		if(staging_path.match("no-cache")){
			staging_path = staging_path.replace(".no-cache","");
		}
		let staging = document.createElement("div");
		staging.innerHTML="<h4>Staging: </h4> <br>"+`<a target:"_blank" href="${staging_path}">${staging_path}</a> <hr>`;
		document.body.appendChild(staging);

		staging.addEventListener("click", function(){
			chrome.tabs.create({ url: staging_path });
		});
		
		// ! ------------------------------------------ Create LIVE path ------------------------------------------
		let live_path = `https://www.bmwusa.com/${tabs[0].url.split(".co/")[1]}`
		if(live_path.match("no-cache")){
			live_path = live_path.replace(".no-cache","");
		}
		let live = document.createElement("div");
		live.innerHTML="<h4>Live: </h4> <br>"+`<a target:"_blank" href="${live_path}">${live_path}</a>`;
		document.body.appendChild(live);

		live.addEventListener("click", function(){
			chrome.tabs.create({ url: live_path });
		});
	}
	else{
		let unknown = document.createElement("div");
		unknown.innerHTML="<h3>Unknown Domain<h3>"
		document.body.appendChild(unknown); 
	}
});
let btnShowGrid = document.getElementById("btnShowGrid");

btnShowGrid.addEventListener("click", async () => {
	console.log('clicked')
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
	  target: { tabId: tab.id },
	  function: addgridtobody,
	});
});
  
function addgridtobody() {
	console.log('show')
	document.body.classList.toggle('show-bmw-grid-overlay');
}