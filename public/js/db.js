var sqlite3 = require("sqlite3").verbose();
const path = require('path')

let db = new sqlite3.Database(path.join(__dirname+'/public/db/database.db'), (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to SQlite database.');
});

var g_Macos = new Array();
var g_mapMacos = new Map();


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
            throw err;
        }else{
            rows.forEach((row) => {
                g_Macos.push(row);
                g_mapMacos.set(row.id, row);
                appendMacosURLs(`#macourl-${row.region_name}`,row)
            });
        }
    });
}
getMacos()

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