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
function bringModelsFromJSON() {
    $.ajax({
        type: "GET",
        url: '../public/js/models.json',
        contentType: "application/json",
    }).then((response) => {
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

function selectModel(model) {
    $("#authorURLs").html("")
    let authorEditor = "https://author.staging.bmwusacm.co/editor.html/content/bmwusa";
    let authorAdmin = "https://author.staging.bmwusacm.co/sites.html/content/bmwusa";
    $("#authorURLs").append(`<p class="my-2">Editor:</p>`);
    g_modelsURLs.forEach(element => {
        if(element.includes(model.toLowerCase())) {
            let authorURL =  authorEditor + element.split(".com")[1];
            $("#authorURLs").append(`
                <span role="button" class="btn-to-clip badge bg-light text-dark mb-2"
                data-bs-toggle="tooltip" data-bs-placement="right" title="Copy to Clipboard" 
                data-clipboard-text="${authorURL}">${authorURL}</span>
            `)
        }
    });
    $("#authorURLs").append(`<p class="my-2">Sites:</p>`);
    g_modelsURLs.forEach(element => {
        if(element.includes(model.toLowerCase())) {
            let authorURL =  authorAdmin + element.split(".com")[1].split(".html")[0];
            $("#authorURLs").append(`
                <span role="button" class="btn-to-clip badge bg-light text-dark mb-2"
                data-bs-toggle="tooltip" data-bs-placement="right" title="Copy to Clipboard" 
                data-clipboard-text="${authorURL}">${authorURL}</span>
            `)
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