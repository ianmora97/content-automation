const Sitemapper = require('sitemapper');
const sitemap = new Sitemapper();
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
function crawlerGraphV2(){
    let arr = new Array();
    arr.push({data: {id: "bmwusa", url: "https://www.bmwusa.com/", name: "BMW USA", nodeName: "bmwusa.com", length: 50}});
    g_sitemap_sites.sort();
    g_sitemap_sites.forEach((e,i) => {
        let path = e.split(".com")[1];
        let first = path.split("/")[1];
        let length_path = path.split("/").length;
        if(first != undefined && first.includes(".html")){
            sitesCollection.push({data: {id: first, name: first, nodeName: first, url: e, length: (length_path * 5)}});
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
                if(a.includes(".html")){
                    sitesCollection.push({data: {id: id, name: namea, nodeName: a, url: e, length: ((height - j) * 5)}});
                }
                arr.push({data: {id: id, name: namea, nodeName: a, url: e, length: ((height - j) * 5)}});
                arr.push({data: {id: `${id}-${parent}`, source: parent, target: id }});
            });
        }
    });
    return arr;
}
var sitesCollection = new Array();
function showCytoScape(){
    let arr = crawlerGraphV2();
    cy = cytoscape({
        container: document.getElementById('canvas'), // container to render in
        elements: arr,
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#F2CC39',
                    'label': 'data(nodeName)',
                    'color': '#fff',
                    'width': "data(length)",
                    'height': "data(length)",
                    'font-size': "3px",
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
            animationDuration: 500,
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
            fillModalSitemap(node);
        }
    });
    cy.center();
    cy.fit();
}
function fillModalSitemap(node){
    let j = cy.$('#'+node.id);
    cy.animate({
        fit: {
            eles: j,
            padding: 30
        }
        }, {
        duration: 1000
    });
    $("#sitemap_id").html(node.id.replace(/\_/g,'/'));
    let live = node.url;
    let prod = "https://www.prod.bmwusacm.co/"+node.id.replace(/\_/g,'/');
    let staging = "https://www.staging.bmwusacm.co/"+node.id.replace(/\_/g,'/');
    let author = "https://author.staging.bmwusacm.co/editor.html/"+node.id.replace(/\_/g,'/');
    let sites = "https://author.staging.bmwusacm.co/sites.html/"+node.id.replace(/\_/g,'/');
    let aem = `<img src="../img/aem.png" width="20px">`;
    let bmw = `<img src="../img/bmw.svg" width="20px">`;
    $("#sitemap_url").html(`
        <hr>
        <div class="bg-dark rounded-15 p-3 mb-2">
            ${bmw} Live:
            <hr>
            <div class="d-flex justify-content-between align-items-center">
                <p class="mb-0 text-decoration-underline">${live}</p>
                <a role="button" class="text-white" id="live-LinkSi†emapModal" onclick="openExternalLink('${live}')"><i class="fa-brands fa-safari fa-2x"></i></a>
            </div>
        </div>
        <div class="bg-dark rounded-15 p-3 mb-2">
            ${bmw} Prod:
            <hr>
            <div class="d-flex justify-content-between align-items-center">
                <p class="mb-0 text-decoration-underline">${prod}</p>
                <a role="button" class="text-white" id="prod-LinkSi†emapModal" onclick="openExternalLink('${prod}')"><i class="fa-brands fa-safari fa-2x"></i></a>
            </div>
        </div>
        <div class="bg-dark rounded-15 p-3 mb-2">
            ${bmw} Staging:
            <hr>
            <div class="d-flex justify-content-between align-items-center">
                <p class="mb-0 text-decoration-underline">${staging}</p>
                <a role="button" class="text-white" id="staging-LinkSi†emapModal" onclick="openExternalLink('${staging}')"><i class="fa-brands fa-safari fa-2x"></i></a>
            </div>
        </div>
        <div class="bg-dark rounded-15 p-3 mb-2">
            ${aem} Author:
            <hr>
            <div class="d-flex justify-content-between align-items-center">
                <p class="mb-0 text-decoration-underline">${author}</p>
                <a role="button" class="text-white" id="author-LinkSi†emapModal" onclick="openExternalLink('${author}')"><i class="fa-brands fa-safari fa-2x"></i></a>
            </div>
        </div>
        <div class="bg-dark rounded-15 p-3 mb-2">
            ${aem} Sites:
            <hr>
            <div class="d-flex justify-content-between align-items-center">
                <p class="mb-0 text-decoration-underline">${sites}</p>
                <a role="button" class="text-white" id="sites-LinkSi†emapModal" onclick="openExternalLink('${sites}')"><i class="fa-brands fa-safari fa-2x"></i></a>
            </div>
        </div>
    `);
    // tippy
    tippy('#live-LinkSi†emapModal', {
        content: 'Open in browser',
        placement: 'top',
        animation: 'shift-away-extreme',
    });
    tippy('#prod-LinkSi†emapModal', {
        content: 'Open in browser',
        placement: 'top',
        animation: 'shift-away-extreme',
    });
    tippy('#staging-LinkSi†emapModal', {
        content: 'Open in browser',
        placement: 'top',
        animation: 'shift-away-extreme',
    });
    tippy('#author-LinkSi†emapModal', {
        content: 'Open in browser',
        placement: 'top',
        animation: 'shift-away-extreme',
    });
    tippy('#sites-LinkSi†emapModal', {
        content: 'Open in browser',
        placement: 'top',
        animation: 'shift-away-extreme',
    });
    let name = node.url.split(".com")[1].replace(/\//g,' ').replace('.html','');
    $("#sitemap_name").html(name);
    sitemapModal.show();
}
function changeGraphLayout(name){
    cy.layout({
        name: name,
        animate: true,
        animationDuration: 500,
        spacingFactor: 3,
        avoidOverlap: true,
        padding: 100,
        roots: '#bmwusa'
    }).run();
}
function searchonSitemap(){
    let search = $("#inputBarSitemap").val();
    if(search.length > 0){
        $(".dropdown-search").html('')
        $(".dropdown-search").addClass("active");
        [...new Set(sitesCollection)]
        .map(e => {return {id:e.data.id, url:e.data.url}})
        .filter(e => e.url.includes(search))
        .forEach(e => {
            $(".dropdown-search").append(`<button class="dropdown-item" onclick="openSitemapModal('${e.id}', '${e.name}', '${e.nodeName}', '${e.url}', '${e.length}')">${e.url}</button>`)
        });
    }else{
        $(".dropdown-search").removeClass("active");
    }
}
function openSitemapModal(id, name, nodeName, url, length){
    $("#inputBarSitemap").val('')
    $(".dropdown-search").removeClass("active");
    $(".dropdown-search").html('')
    let _url = url.split(".com/")[1].replace(/\//g,'_');
    let j = cy.$('#'+_url);
    cy.animate({
        fit: {
            eles: j,
            padding: 100
        }
        }, {
        duration: 1000
    });
    setTimeout(() => {
        fillModalSitemap({id, name, nodeName, url, length});
    }, 1000);
}

function bringAllData(){
    sitemapFetch();
}
document.addEventListener('DOMContentLoaded', function() {
    bringAllData();
});
