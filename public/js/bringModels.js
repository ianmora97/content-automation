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
    arr.push({data: {id: "bmwusa", url: "https://www.bmwusa.com/", name: "BMW USA", nodeName: "bmwusa.com", length: 50}});
    g_sitemap_sites.sort();
    g_sitemap_sites.forEach((e,i) => {
        let path = e.split(".com")[1]; // * get the path after .com
        let first = path.split("/")[1];
        let length_path = path.split("/").length;
        if(first != undefined && first.includes(".html")){
            arr.push({data: {id: first, name: first, nodeName: first, url: e, length: (length_path * 5)}});
            arr.push({data: {id: `${first}-bmwusa`, source: 'bmwusa', target: first }});
        }else{
            let children = path.split("/"); // * get all the children
            children.shift(); // * remove the first element ("") as it empty
            children = children.filter(e => (e != "")); // * remove empty elements
            let height = children.length; // ! get the height of the tree
            children.forEach((a,j) => {
                let namea = path.replace(/\//g,' ' ).replace('.html','').replace('-'," ");
                let id = j == 0 ? a : children.slice(0,j+1).join("_");
                let parent = j == 0 ? "bmwusa" : children.slice(0,j).join("_");
                arr.push({data: {id: id, name: namea, nodeName: a, url: e, length: ((height - j) * 5)}});
                arr.push({data: {id: `${id}-${parent}`, source: parent, target: id }});
            });
        }
    });
    return arr;
}

function showCytoScape(){
    let arr = crawlerGraphV2();
    cy = cytoscape({
        container: document.getElementById('canvas'), // container to render in
        elements: arr,
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#242424',
                    'label': 'data(nodeName)',
                    'color': '#fff',
                    'width': "data(length)",
                    'height': "data(length)",
                    'font-size': "3px",
                    "border-color": "#f0f0f0",
                    "border-width": "0.7px",
                    'background-image': '../img/bmw.svg',
                    'background-fit': 'cover cover',
                    'background-image-opacity': 1
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 0.8,
                    'line-color': '#fff',
                    'target-arrow-color': '#fff',
                    'curve-style': 'bezier',
                }
            }
        ],
        zoom: 1,
        layout: {
            name: 'cose',
            circle: false,
            grid: false,
            spacingFactor: 3,
            avoidOverlap: true,
            animate: true,
            animationDuration: 300,
            padding: 100,
            roots: '#bmwusa'
        }
    });
    // on node over show the node's url on pageNameCy
    cy.on('mouseover', 'node', function(e){
        let node = e.target._private.data;
        let url = node.id;
        $("#pageNameCy").html(url.replace(/\_/g,'/'));
    });
    cy.on('click', 'node', function(evt){
        let node = evt.target._private.data;
        if(node.id != undefined && node.nodeName.includes(".html")){
            $("#sitemap_id").html(node.id);
            $("#sitemap_url").html(`
                <a role="button" class="text-primary" onclick="openExternalLink('${node.url}')">${node.url}</a>
            `);
            $("#sitemap_name").html(node.name.replace(".html","").replace("-"," "));
            sitemapModal.show();
        }
    });
    cy.center();
    cy.fit();
}
function changeGraphLayout(name){
    cy.layout({
        name: name,
        animate: false,
        spacingFactor: 3,
        avoidOverlap: true,
        padding: 100,
        roots: '#bmwusa'
    }).run();
}
function bringAllData(){
    bringModelsfromBMW();
    sitemapFetch();
}
document.addEventListener('DOMContentLoaded', function() {
    bringAllData();
});
