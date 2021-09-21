function xmlToJson( xml ) { 
    // Create the return object
    var obj = {};
   
    if ( xml.nodeType == 1 ) { // element
      // do attributes
      if ( xml.attributes.length > 0 ) {
      obj["@attributes"] = {};
        for ( var j = 0; j < xml.attributes.length; j++ ) {
          var attribute = xml.attributes.item( j );
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if ( xml.nodeType == 3 ) { // text
      obj = xml.nodeValue;
    }
   
    // do children
    if ( xml.hasChildNodes() ) {
      for( var i = 0; i < xml.childNodes.length; i++ ) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if ( typeof(obj[nodeName] ) == "undefined" ) {
          obj[nodeName] = xmlToJson( item );
        } else {
          if ( typeof( obj[nodeName].push ) == "undefined" ) {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push( old );
          }
          obj[nodeName].push( xmlToJson( item ) );
        }
      }
    }
    return obj;
};
var g_modelsJSON = [];
function bringModelsFromJSON() {
    $.ajax({
        type: "GET",
        url: 'public/js/models.json',
        contentType: "application/json",
    }).then((response) => {
        g_modelsJSON = response.models;
        addToModalDeploymentD();
        response.models.forEach(element => {
            $("#modelsScrollHorizontal").append(`
                <div class="d-flex align-items-center flex-column me-4 carModelSelect" 
                role="button" onclick="selectModel('${element.name}')" id="model-${element.name}">
                    <img src="${element.url}" width="142px" loading="lazy">
                    <h3>${element.name}</h3>
                </div>
            `)
            addToModalDeployment(element);
        });
    }, (error) => {
        
    });
}
bringModelsFromJSON()

function addToModalDeploymentD() {
    $("#dropdownselectModeldd").append(`
        <li>
            <button class="dropdown-item" type="button" 
            onclick="updateModelDropdownS('none','none')">
                <h5 class="fw-bold d-inline">None</h5>
            </button>
        </li>
    `)
}
function addToModalDeployment(car){
    $("#dropdownselectModeldd").append(`
        <li>
            <button class="dropdown-item" type="button" id="select-model-${car.name}" 
            onclick="updateModelDropdownS('${car.name}','${car.url}')">
                <img src="${car.url}" width="50px" loading="lazy"><h5 class="fw-bold d-inline">${car.name}</h5>
            </button>
        </li>
    `)
}

function searchByModel(){
    $("#searchModel").on("keyup", function() {
        $("#modelsScrollHorizontal").html("")
        let val = $("#searchModel").val();
        g_modelsJSON.forEach(element => {
            if(element.name.toLowerCase().includes(val.toLowerCase())){
                $("#modelsScrollHorizontal").append(`
                    <div class="d-flex align-items-center flex-column me-4 carModelSelect ${val.length ? 'hover' : ''}" 
                    role="button" onclick="selectModel('${element.name}')" id="model-${element.name}">
                        <img src="${element.url}" width="142px" loading="lazy">
                        <h3>${element.name}</h3>
                    </div>
                `)
            }
        });
    });
}



function closeModelMYU() {
    $("#modelsAfterSelected").html("")
    $(".modelsAfterSelectedP").hide()
    $("#authorURLs").html("")
}
function appendURLs(authorShow,authorURL,id) {
    $(id).append(`
    <div class="d-flex mb-1 animate__animated animate__flipInX">
        <div class="bg-dark d-flex justify-content-start align-items-center">
            <span role="button" style="font-size: 16px;" data-clipboard-text="${authorURL}" class=" badge text-white btn-to-clip"
            data-bs-toggle="tooltip" data-bs-placement="top" title="Copy"><i class="far fa-copy"></i></span>
            
            <span role="button" style="font-size: 16px;" onclick="openExternalLink('${authorURL}')" class=" badge text-white btn-to-clip"
            data-bs-toggle="tooltip" data-bs-placement="top" title="Open in Browser"><i class="fab fa-safari"></i></span>
            
            <p class="m-0 p-1 text-decoration-underline text-light" style="white-space: nowrap !important; font-size: 13px;">${authorShow}</p>
        </div>
    </div>
    `)
}
function selectModel(model) {
    $("#authorURLs").html("")
    let modelImage = g_modelsJSON.filter(element => element.name == model)[0];
    $("#modelsAfterSelected").html(`
        <div class="d-flex justify-content-start pt-3 align-items-center px-3">
            <img src="${modelImage.url}" width="250px">
            <h2>${modelImage.name}</h2>
        </div>
        <div style="position:absolute;top:8px;right:8px;">
            <button class="btn-close btn-close-white" onclick="closeModelMYU()"></button>
        </div>
    `)
    animateCSS("#modelsAfterSelected", "fadeIn");
    $(".modelsAfterSelectedP").show()

    enablePopovers()
    let authorEditor = "https://author.staging.bmwusacm.co/editor.html/content/bmwusa";
    let authorAdmin = "https://author.staging.bmwusacm.co/sites.html/content/bmwusa";
    let authorShowEditor = "editor.html/content/bmwusa";
    let authorShowAdmin = "sites.html/content/bmwusa";

    $("#authorURLs").append(`
    <div class="accordion accordion-flush" id="acordionmyuurls">
        <div class="accordion-item">
            <h2 class="accordion-header" id="editorheadline">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOneeditor" aria-expanded="true" aria-controls="collapseOneeditor">
                    <div class="d-flex justify-content-start align-items-center">
                        <img src="public/img/aem.png" width="25px" class="d-inline me-2"> Editor:
                    </div>
                </button>
            </h2>
            <div id="collapseOneeditor" class="accordion-collapse collapse show" aria-labelledby="editorheadline" data-bs-parent="#acordionmyuurls">
                <div class="accordion-body" id="editorURLsGen">

                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwosites">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    <div class="d-flex justify-content-start align-items-center">
                        <img src="public/img/aem.png" width="25px" class="d-inline me-2"> Sites:
                    </div>
                </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwosites" data-bs-parent="#acordionmyuurls">
                <div class="accordion-body" id="sitesURLsGen">
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingThreestaging">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThreestaging" aria-expanded="false" aria-controls="collapseThreestaging">
                    <img src="public/img/bmw.svg" width="20px" class="d-inline me-2 ms-1"> Staging:
                </button>
            </h2>
            <div id="collapseThreestaging" class="accordion-collapse collapse" aria-labelledby="headingThreestaging" data-bs-parent="#acordionmyuurls">
                <div class="accordion-body" id="stagingURLs">
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="prodheadiingcollapse">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseprod" aria-expanded="false" aria-controls="collapseprod">
                    <img src="public/img/bmw.svg" width="20px" class="d-inline me-2 ms-1"> Prod:
                </button>
            </h2>
            <div id="collapseprod" class="accordion-collapse collapse" aria-labelledby="prodheadiingcollapse" data-bs-parent="#acordionmyuurls">
                <div class="accordion-body" id="prodURLs">
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headinglive">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapselive" aria-expanded="false" aria-controls="collapselive">
                    <img src="public/img/bmw.svg" width="20px" class="d-inline me-2 ms-1"> Live:
                </button>
            </h2>
            <div id="collapselive" class="accordion-collapse collapse" aria-labelledby="headinglive" data-bs-parent="#acordionmyuurls">
                <div class="accordion-body" id="liveURLs">
                </div>
            </div>
        </div>
    </div>
    `)
    g_modelsURLs.forEach(element => {
        if(model.length == 1){
            if(element.includes(model+"-series")) {
                let authorURL =  authorEditor + element.split(".com")[1];
                let authorShow = authorShowEditor + element.split(".com")[1];
                appendURLs(authorShow,authorURL,"#editorURLsGen")
            }
        }else{
            if(element.includes(model.toLowerCase())) {
                let authorURL =  authorEditor + element.split(".com")[1];
                let authorShow = authorShowEditor + element.split(".com")[1];
                appendURLs(authorShow,authorURL,"#editorURLsGen")
            }
        }
    });
    g_modelsURLs.forEach(element => {
        if(model.length == 1) {
            if(element.includes(model+"-series")) {
                let authorURL =  authorAdmin + element.split(".com")[1].split(".html")[0];
                let authorShow = authorShowAdmin + element.split(".com")[1];
                appendURLs(authorShow,authorURL,"#sitesURLsGen")
            }
        }else{
            if(element.includes(model.toLowerCase())) {
                let authorURL =  authorAdmin + element.split(".com")[1].split(".html")[0];
                let authorShow = authorShowAdmin + element.split(".com")[1];
                appendURLs(authorShow,authorURL,"#sitesURLsGen")
            }
        }
    });
    g_modelsURLs.forEach(element => {
        if(model.length == 1) {
            if(element.includes(model+"-series")) {
                let authorURL =  "https://www.staging.bmwusacm.co" + element.split(".com")[1];
                appendURLs(authorURL,authorURL,"#stagingURLs")
            }
        }else{
            if(element.includes(model.toLowerCase())) {
                let authorURL =  "https://www.staging.bmwusacm.co" + element.split(".com")[1];
                appendURLs(authorURL,authorURL,"#stagingURLs")
            }
        }
    });
    g_modelsURLs.forEach(element => {
        if(model.length == 1) {
            if(element.includes(model+"-series")) {
                let authorURL =  "https://www.prod.bmwusacm.co" + element.split(".com")[1];
                appendURLs(authorURL,authorURL,"#prodURLs")
            }   
        }else{
            if(element.includes(model.toLowerCase())) {
                let authorURL =  "https://www.prod.bmwusacm.co" + element.split(".com")[1];
                appendURLs(authorURL,authorURL,"#prodURLs")
            }
        }
    });
    g_modelsURLs.forEach(element => {
        if(model.length == 1) {
            if(element.includes(model+"-series")) {
                appendURLs(element,element,"#liveURLs")
            }
        }else{
            if(element.includes(model.toLowerCase())) {
                appendURLs(element,element,"#liveURLs")
            }
        }

    });

    enableTooltips();
}
var g_modelsURLs = [];
function bringModelsfromBMW(){
    let sitemap = {};
    $.ajax({
        type: "GET",
        url: 'https://www.bmwusa.com/sitemap.xml',
        contentType: "application/json",
    }).then((response) => {
        sitemap = xmlToJson(response);
        let urls = sitemap.urlset.url;
        urls.forEach(element => {
            if(Object.values(element.loc)[0].includes("/vehicles/")){
                g_modelsURLs.push(Object.values(element.loc)[0]);
            }            
        });
    }, (error) => {
    
    });
}
bringModelsfromBMW()
// function bringModelsfromBMW(){ 
//     $.ajax({
//         type: "GET",
//         url: 'https://www.bmwusa.com/',
//         contentType: "application/json",
//     }).then((response) => {
//         var i = response.split("globalnav-primary-vehicles__car").slice(2,16)
//         i.forEach((e) => {
//             let a = e.split("\"imageUrl\" : \"")[1].split("\"isDamAsset\"")[0].replaceAll("amp;","").split("\",")[0];
            
//         })
//     }, (error) => {
    
//     });
// }
document.addEventListener('DOMContentLoaded', function() {
    searchByModel();
});