
console.log('CONTENT SCRIPT LOADED');

function showImageInfo() {
    console.log("showImageInfo");
	window.scrollTo({
		top: document.body.scrollHeight,
		behavior: 'smooth',
	})
	
	setTimeout(() => {
		window.scrollTo(0, 0);
		let imagesMap = new Map();
		let images = new Array();

		Array.from(document.querySelectorAll("img")).forEach(e => {
			let src = e.getAttribute("src");
			if(src){
				if(imagesMap.has(src)){
					// Do nothing
				}else{
					imagesMap.set(src, e);
					images.push(e);
				}
			}
		});
		images = images.filter((e,i) =>{
			if(!e.src.includes("global-nav") &&
				!e.src.includes("global") &&
				!e.src.includes("nav") && 
				!e.src.includes("cosy") &&
				!e.src.includes("bing")){
				return true;
			}else{
				return false;
			}
		});
		images.forEach((e,i) =>{
			if(document.getElementById("imageInfoBtn-element-"+i)){
				document.getElementById("imageInfoBtn-element-"+i).remove();
			}else{
				let body = document.body;
				let elm = document.createElement("div");
				elm.id = "imageInfoBtn-element-"+i;
				elm.style.position = "absolute";
				elm.style.top =	e.offsetTop + 10 + "px";
				elm.style.left = e.offsetLeft + 10 + "px";
				elm.style.width = "50px";
				elm.style.height = "50px";
				elm.style.backgroundColor = "#f1f1f1";
				elm.style.border = "1px solid #ffffff";
				elm.style.borderRadius = "50%";
				elm.style.zIndex = "99999999999";
				elm.style.cursor = "pointer";
				elm.style.paddingLeft = "1.5px";
				elm.style.paddingTop = "6.5px";
				elm.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.5)";
				elm.innerHTML = `<span><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Ic_settings_48px.svg/2048px-Ic_settings_48px.svg.png" style="width:35px; height:35px"></span>`;
				body.appendChild(elm);
			}
		});
	}, 1800);
}