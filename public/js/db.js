var sqlite3 = require("sqlite3").verbose();
const path = require('path')

let db = new sqlite3.Database(path.join(__dirname+'/public/db/database.db'), (err) => {
    if (err) {
      return console.error(err.message);
    }else{
        getMacos();
        getMacosbyRegion();
        console.log('Connected to SQlite database.');
    }
});

var g_Macos = new Array();
var g_mapMacos = new Map();


function enableTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

function appendMacosURLs(id,maco,env = "") {
    let url = `https://www.bmwusa.com/home.html?maco=${maco.code}`;

    $(id).append(`
    <div class="d-flex mb-1 animate__animated animate__flipInX">
        <div class="col-5 bg-dark">
            <p class="m-0 p-1 text-light d-flex align-items-center" style="white-space: nowrap !important; 
            font-size: 13px;"> <i class="fas fa-circle text-primary pe-2 align-self-center" 
            style="font-size: 7px;"></i> ${maco.name}</p>
        </div>
        <div class="col-5 bg-dark">
            <p class="m-0 p-1 text-light" style="white-space: nowrap !important; 
            font-size: 13px;"><span class="text-primary fw-bold">${maco.code}</span></p>
        </div>
        <div class="col-2 bg-dark d-flex justify-content-end align-items-center pe-2">
            <span role="button" style="font-size: 16px;" data-clipboard-text="${url}" class=" badge text-white btn-to-clip"
            data-bs-toggle="tooltip" data-bs-placement="top" title="Copy"><i class="far fa-copy"></i></span>
            
            <span role="button" style="font-size: 16px;" onclick="openExternalLink('${url}')" class=" badge text-white btn-to-clip"
            data-bs-toggle="tooltip" data-bs-placement="top" title="Open in Browser"><i class="fab fa-safari"></i></span>
        </div>
    </div>
    `)
    enableTooltips();
}

function getMacos() {
    db.all("SELECT * FROM v_macos", [], (err, rows) => {
        if (err) {
            console.log(err);
        }else{
            rows.forEach((row) => {
                g_Macos.push(row);
                g_mapMacos.set(row.id, row);
                appendMacosURLs(`#macourl-${row.region_name}`,row)
            });
        }
    });
}
function emptyModal(){
    $('#macosModalurl-central').html('');
    $('#macosModalurl-east').html('');
    $('#macosModalurl-west').html('');
    $('#macosModalurl-south').html('');
}
function getMacosbyRegion(){
    // when modal is opened
    var myModalEl = document.getElementById('regionURLs')
    myModalEl.addEventListener('show.bs.modal', function (event) {
        emptyModal();
        let regions = ['central','east','west','south'];
        let envs = [{name:'Staging',code:'s'},{name:'Prod',code:'p'},{name:'Live',code:'l'}];
        envs.forEach((env)=>{
            regions.forEach((region) => {
                $(`#macosModalurl-${region}`).append(`
                    <div class="d-flex justify-content-start my-2">
                        <h5 class="mb-0 mt-2">${env.name}:</h5>
                    </div>
                `)
                g_Macos.filter(maco => maco.region_name == region).forEach((maco) => {
                    appendURLmacoModal(maco,region,env);
                })
            });
        })
    })
}
function appendURLmacoModal(maco,region,env) {
    if(env.code == "l"){
        $(`#macosModalurl-${region}`).append(
            `<p class="mb-0 text-light" style="font-size:13px;">https://www.bmwusa.com/home.html?maco=${maco.code}</p>`
        );
    }else{
        $(`#macosModalurl-${region}`).append(
            `<p class="mb-0 text-light" style="font-size:13px;">https://www.${env.name.toLowerCase()}.bmwusacm.co/home.html?maco=${maco.code}</p>`
        );
    }
}
// document.addEventListener('DOMContentLoaded', function() {
//     getMacos();
//     getMacosbyRegion();
// });

function openMacoLinks(region,env) {
    let macos = g_Macos.filter(maco => maco.region_name == region);
    macos.forEach((maco) => {
        if(env == "l"){
            openExternalLink(`https://www.bmwusa.com/home.html?maco=${maco.code}`);
        }else if(env == "p"){
            openExternalLink(`https://www.prod.bmwusacm.co/home.html?maco=${maco.code}`);
        }else{
            openExternalLink(`https://www.staging.bmwusacm.co/home.html?maco=${maco.code}`);
        }
    });
}