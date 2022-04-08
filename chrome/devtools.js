

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
const queryImageOnDOM = (e) => `
document.querySelector("[src='${e.src}']").scrollIntoView({
	behavior: 'smooth'
});
document.querySelector("[src='${e.src}']").style.border = "8px solid blue";
setTimeout(() => {
	document.querySelector("[src='${e.src}']").style.border = "";
}, 2000);
`;
const changeImage = (e, n) => `
	document.querySelector("[srcset='${e.src}']").setAttribute("srcset", "${n}")
	document.querySelector("[src='${e.src}']").setAttribute("src", "${n}")
`;

btnImagesInfo.addEventListener("click", () => {
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
					<td>${i+1}</td>
					<td id="queryImageSelector-${i}">
						<span style="cursor:pointer;">
							${e.src}
						</span>
					</td>
					<td>${e.alt}</td>
					<td>
						<div class="d-flex jcs a-i-e" style="width:100%;">
							<input type="text" class="form-control-light form-sm" id="inputQueryImage-${i}">
							<button id="btnQueryImage-${i}" class="btn-primary btn-sm" style="margin-left:10px;"><i class="fa-solid fa-repeat"></i></button>
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
				console.log("IMAGEN NUEVA", newSrc);
				chrome.devtools.inspectedWindow.eval(changeImage(e,newSrc),function(result,isError){
					console.log(result);
				});
			});
		});
	});
});