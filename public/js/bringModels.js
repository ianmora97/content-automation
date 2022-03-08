const Sitemapper = require('sitemapper');
const sitemap = new Sitemapper();

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
        checkError("sitemap",error.status)
    });
}

var g_sitemap_sites = new Array()

function sitemapFetch(){
    sitemap.fetch('https://www.bmwusa.com/sitemap.xml').then(function(sites) {
        g_sitemap_sites = sites.sites;
        promtDataSitemap();
    });
}
function promtDataSitemap(){
    $("#sitemap_totalSites").html(g_sitemap_sites.length);
    showCytoScape();
}
var cy;
var sitemapModal = new bootstrap.Modal(document.getElementById('sitemap_modal'));


function crawlerGraph(){
    let arr = new Array();
    arr.push({data: {id: "bmwusa", url: "https://www.bmwusa.com/", name: "BMW USA", length: 100}});

    g_sitemap_sites.forEach((e,i) => {
        let serve = e.split(".com")[1];
        let first = serve.split("/")[1];
        let length_serve = serve.split("/").length;
        console.log(serve);
        if(first != undefined && first.includes(".html")){
            arr.push({data: {id: i, name: first, url: e, length: (length_serve + 15)}});
            arr.push({data: {id: first, source: 'bmwusa', target: i }});
        }
    });
    return arr;
}
function crawlerGraphV2(){
    let arr = new Array();
    let mapError = new Map();
    arr.push({data: {id: "bmwusa", url: "https://www.bmwusa.com/", name: "BMW USA", length: 50}});
    g_sitemap_sites.forEach((e,i) => {
        let path = e.split(".com")[1]; // * get the path after .com
        let children = path.split("/"); // * get all the children
        children.shift(); // * remove the first element ("") as it empty
        children = children.filter(e => (e != "")); // * remove empty elements
        let height = children.length; // ! get the height of the tree

        let first = path.split("/")[1];
        let length_path = path.split("/").length;
        if(first != undefined && first.includes(".html")){
            if(mapError.get(i) == undefined){
                arr.push({data: {id: first, name: first, url: e, length: (length_path + 15)}});
                arr.push({data: {id: `${first}-bmwusa`, source: 'bmwusa', target: first }});
                mapError.set(i,0);
            }else{
                // nada
            }
        }else{
            
            children.forEach((a,j) => {
                if(mapError.get(a) == undefined){
                    mapError.set(a,0);
                    let parent = j == 0 ? "bmwusa" : children[j-1];
                    arr.push({data: {id: a, name: a, url: e, length: (height + 15)}});
                    arr.push({data: {id: `${a}-${parent}`, source: parent, target: a }});
                }
            });
        }
        // let length_path = path.split("/").length;
        // arr.push({data: {id: i, name: path, url: e, length: (length_path + 15)}});
        // arr.push({data: {id: first, source: 'bmwusa', target: i }});
    });
    arr.forEach(e => {
        if(e.data.target != undefined){
            console.log(e.data.source,"->",e.data.target);
        }
    })
    return arr;
}

function showCytoScape(){
    let arr = crawlerGraphV2();
    console.log(arr);
    cy = cytoscape({
        container: document.getElementById('canvas'), // container to render in
        elements: arr,
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#4659e4',
                    'color': '#fff',
                    'width': "data(length)",
                    'height': "data(length)",
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 1,
                    'line-color': '#fff',
                    'target-arrow-color': '#fff',
                    'curve-style': 'bezier',
                    "target-distance-from-node": 5,
                }
            }
        ],
        zoom: 1,
        pan: { x: 500, y: 300 },
        layout: {
            name: 'breadthfirst',
            padding: 1,
            fit: true
        }
    });
    // on node over show the node's url on pageNameCy
    cy.on('mouseover', 'node', function(e){
        let node = e.target._private.data;
        let url = node.url;
        console.log(node, url);
        if(url != "bmwusa"){
            $("#pageNameCy").html(url);
        }
        
    });

    cy.on('click', 'node', function(evt){
        let node = evt.target._private.data;
        if(node.id != undefined){
            $("#sitemap_id").html(node.id);
            $("#sitemap_url").html(`
                <a role="button" class="text-primary" onclick="openExternalLink('${node.url}')">${node.url}</a>
            `);
            $("#sitemap_name").html(node.name.replace(".html","").replace("-"," "));
            sitemapModal.show();
        }
    });
}

function bringAllData(){
    bringModelsfromBMW();
    sitemapFetch();
}
document.addEventListener('DOMContentLoaded', function() {
    bringAllData();
});