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
        response.models.forEach(element => {
            $("#modelsScrollHorizontal").append(`
                <div class="d-flex align-items-center flex-column me-4 carModelSelect" 
                role="button" onclick="selectModel('${element.name}')">
                    <img src="${element.url}" width="142px">
                    <h3>${element.name}</h3>
                </div>
            `)
        });
    }, (error) => {
        
    });
}
bringModelsFromJSON()

function closeModelMYU() {
    $("#modelsAfterSelected").html("")
    $(".modelsAfterSelectedP").hide()
    $("#authorURLs").html("")
}
function appendURLs(authorShow,authorURL,id) {
    $(id).append(`
    <div class="d-flex mb-1 animate__animated animate__flipInX">
        <div class="col-10 bg-dark">
            <p class="m-0 p-1 text-decoration-underline text-light" style="white-space: nowrap !important; font-size: 13px;">${authorShow}</p>
        </div>
        <div class="col-2 bg-dark d-flex justify-content-start align-items-center">
            <span role="button" style="font-size: 16px;" data-clipboard-text="${authorURL}" class=" badge text-white btn-to-clip"
            data-bs-toggle="tooltip" data-bs-placement="top" title="Copy"><i class="far fa-copy"></i></span>
            
            <span role="button" style="font-size: 16px;" onclick="openExternalLink('${authorURL}')" class=" badge text-white btn-to-clip"
            data-bs-toggle="tooltip" data-bs-placement="top" title="Open in Browser"><i class="fab fa-safari"></i></span>
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
    /*
    $("#authorURLs").append(`
    <div class="accordion accordion-flush" id="accordionURLS">
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEditor" aria-expanded="false" aria-controls="collapseEditor">
                <img src="public/img/aem.png" width="25px" class="me-2"> Editor:
            </button>
            </h2>
            <div id="collapseEditor" class="accordion-collapse collapse bg-dark-light" aria-labelledby="headingOne" data-bs-parent="#accordionURLS">
                <div class="accordion-body" id="editorURLsGen">
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSites" aria-expanded="false" aria-controls="collapseSites">
                <img src="public/img/aem.png" width="25px" class="me-2"> Sites:
            </button>
            </h2>
            <div id="collapseSites" class="accordion-collapse collapse bg-dark-light" aria-labelledby="headingTwo" data-bs-parent="#accordionURLS">
                <div class="accordion-body" id="sitesURLsGen">
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseStaging" aria-expanded="false" aria-controls="collapseStaging">
                <img src="public/img/bmw.svg" width="20px" class="me-2 ms-1"> Staging:
            </button>
            </h2>
            <div id="collapseStaging" class="accordion-collapse collapse bg-dark-light" aria-labelledby="headingTwo" data-bs-parent="#accordionURLS">
                <div class="accordion-body" id="stagingURLs"></div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingFour">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseprod" aria-expanded="false" aria-controls="collapseprod">
                <img src="public/img/bmw.svg" width="20px" class="me-2 ms-1"> Prod:
            </button>
            </h2>
            <div id="collapseprod" class="accordion-collapse collapse bg-dark-light" aria-labelledby="headingTwo" data-bs-parent="#accordionURLS">
                <div class="accordion-body" id="prodURLs">
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingFour">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapselive" aria-expanded="false" aria-controls="collapselive">
                <img src="public/img/bmw.svg" width="20px" class="me-2 ms-1"> Live:
            </button>
            </h2>
            <div id="collapselive" class="accordion-collapse collapse bg-dark-light" aria-labelledby="headingTwo" data-bs-parent="#accordionURLS">
                <div class="accordion-body" id="liveURLs">
                </div>
            </div>
        </div>
    </div>
    `);
    */
    $("#authorURLs").append(`
        <div class="d-flex justify-content-between my-2">
            <div class="d-flex justify-content-start align-items-center">
                <img src="public/img/aem.png" width="25px" class="d-inline me-2"> Editor:
            </div>
            <button type="button" class="btn btn-xs btn-primary me-2"><i class="fas fa-external-link-alt"></i> Open all URLs</button>
        </div>
        <div class="border-bottom pb-3 border-light" id="editorURLsGen"></div>

        <div class="d-flex justify-content-between my-2">
            <div class="d-flex justify-content-start align-items-center">
                <img src="public/img/aem.png" width="25px" class="d-inline me-2"> Sites:
            </div>
            <button type="button" class="btn btn-xs btn-primary me-2"><i class="fas fa-external-link-alt"></i> Open all URLs</button>
        </div>
        <div class="border-bottom pb-3 border-light" id="sitesURLsGen"></div>

        <div class="d-flex justify-content-start my-2">
            <img src="public/img/bmw.svg" width="20px" class="d-inline me-2 ms-1"> Staging:
        </div>
        <div class="border-bottom pb-3 border-light" id="stagingURLs"></div>

        <div class="d-flex justify-content-start my-2">
            <img src="public/img/bmw.svg" width="20px" class="d-inline me-2 ms-1"> Prod:
        </div>
        <div class="border-bottom pb-3 border-light" id="prodURLs"></div>

        <div class="d-flex justify-content-start my-2">
            <img src="public/img/bmw.svg" width="20px" class="d-inline me-2 ms-1"> Live:
        </div>
        <div class="border-bottom pb-3 border-light" id="liveURLs"></div>
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