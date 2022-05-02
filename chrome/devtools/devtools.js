

// ! ------------------------------------------ Images Info ------------------------------------------
// * WIP
// TODO: Show a button in the top right corner of all the images on the current page

const btnImagesInfo = document.getElementById("btnImagesInfo");
const inspectImages = `
	[...Array.from(document.querySelectorAll("img")),...Array.from(document.querySelectorAll("source"))].map(e => {
		let src = e.getAttribute("src") || e.getAttribute("srcset");
		let alt = e.getAttribute("alt") || "";
		return ({src:src, alt: alt });
	});
`;
const inspectNameEvents = `
	Array.from(document.querySelectorAll("[analytics-event]")).map(e => {
		let aria = e.getAttribute("aria-label") || e.innerText || e.getAttribute("href");
		let name = e.getAttribute("analytics-event");
		return ({aria:aria, name: name });
	});
`;
const inspectSProps = `
	(function (){
		let sProps = {
			pageName: s.pageName,
		};
		console.log(sProps);
		return sProps;
	}());
`;

const queryImageOnDOM = (e) => `
	document.querySelector("[src='${e.src}']").scrollIntoView({
		behavior: 'smooth'
	});
	document.querySelector("[src='${e.src}']").style.border = "8px solid blue";
	setTimeout(() => {
		document.querySelector("[src='${e.src}']").style.border = "";
	}, 2000);
`;
const queryCTAOnDOM = (e) => `
	document.querySelector("[analytics-event='${e.name}']").scrollIntoView({
		behavior: 'smooth'
	});
	document.querySelector("[analytics-event='${e.name}']").style.border = "5px solid blue";
	setTimeout(() => {
		document.querySelector("[analytics-event='${e.name}']").style.border = "";
	}, 2000);
`;
const changeImage = (e, n) => `
	Array.from(document.querySelectorAll("[srcset='${e.src}']")).forEach(e => {
		e.setAttribute("srcset", "${n}");
	})
	document.querySelector("[src='${e.src}']").setAttribute("src", "${n}")
`;

function sprops(){
	console.log("sprops");
	chrome.devtools.inspectedWindow.eval(inspectSProps,function(result,isError){
		console.log(result);
	});
}
function loadImages() {
	chrome.devtools.inspectedWindow.eval(inspectImages,function(result,isError){
		$('#tableimages_dbody').html('');
		let imagesMap = new Map();
		let images = new Array();
		result.forEach((e,i) =>{
			if(e.src){
				if(!imagesMap.has(e.src)){
					imagesMap.set(e.src, e);
					images.push(e);
				}
			}
		});
		images = images.filter((e,i) =>{
			if(!e.src.includes("global-nav") &&
				!e.src.includes("global") &&
				!e.src.includes("nav") && 
				!e.src.includes("cosy.arox") &&
				!e.src.includes("bing")){
				return true;
			}else{
				return false;
			}
		});
		images.forEach((e,i) =>{
			$('#tableimages_dbody').append(`
				<tr>
					<td style="width:30px;">${i+1}</td>
					<td id="queryImageSelector-${i}" style="max-width:50vw;">
						<span style="cursor:pointer;">
							${e.src}
						</span>
					</td>
					<td>${e.alt}</td>
					<td>
						<div class="d-flex jcs a-i-e" style="width:100%;">
							<input type="text" class="form-control-light form-sm-cus" id="inputQueryImage-${i}">
							<button id="btnQueryImage-${i}" class="btn-primary btn-sm-cus" style="margin-left:10px;"><i class="fa-solid fa-repeat"></i></button>
						</div>
					</td>
				</tr>
			`);
			$(`#queryImageSelector-${i}`).click(function(){
				chrome.devtools.inspectedWindow.eval(queryImageOnDOM(e),function(result,isError){
					console.log(result);
				});
			});
			$(`#btnQueryImage-${i}`).click(function(event){
				let newSrc = $(`#inputQueryImage-${i}`).val();
				chrome.devtools.inspectedWindow.eval(changeImage(e,newSrc),function(result,isError){
					console.log(result);
				});
			});
		});
	});
}
function loadEvents(){
	chrome.devtools.inspectedWindow.eval(inspectNameEvents,function(result,isError){
		$('#tableevents_dbody').html('');
		result.filter(e => {
			if(!e.name.includes("footer") &&
				!e.name.includes("topnav")){
				return true;
			}else{
				return false;
			}
		})
		.forEach((e,i) => {
			$('#tableevents_dbody').append(`
				<tr>
					<td id="queryCTASelector-${i}" style="max-width:50vw;">
						<span style="cursor:pointer;">
							${e.aria}
						</span>
					</td>
					<td>${e.name}</td>
				</tr>
			`);
			$(`#queryCTASelector-${i}`).click(function(){
				chrome.devtools.inspectedWindow.eval(queryCTAOnDOM(e),function(result,isError){
					console.log(result);
				});
			});
		});
	});
}

function openTab(evt, tab) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tab).style.display = "block";
    evt.currentTarget.className += " active";
}

function checkForTabs(){
	Array.from(document.querySelectorAll("[data-tab]")).forEach(e => {
		e.addEventListener("click", function(event){
			openTab(event, e.dataset.tab);
		});
	});
}

document.addEventListener('DOMContentLoaded', function() {
	checkForTabs()
	loadImages();
	loadEvents();
	sprops();
});