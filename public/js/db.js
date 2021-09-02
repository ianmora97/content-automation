var sqlite3 = require("sqlite3").verbose();
const { isFunction } = require("jquery");
const path = require('path')

let db = new sqlite3.Database(path.join(__dirname+'/public/db/database.db'), (err) => {
    if (err) {
      return console.error(err.message);
    }else{
        getMacos();
        getMacosbyRegion();
        bringDeployments();
        addDeployment()
        console.log('Connected to SQlite database.');
    }
});

var g_Macos = new Array();
var g_mapMacos = new Map();
var g_Deployments = new Array();
var g_mapDeployments = new Map();

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
function bringDeployments(){
    db.all("SELECT * FROM v_deployments", [], (err, rows) => {
        if (err) {
            console.log(err);
        }else{
            rows.forEach((row) => {
                g_Deployments.push(row);
                g_mapDeployments.set(row.id, row);
                appendDeploymentsMytickets(row.id,row.name,row.model,"#deploymentsList");
            });
        }
    });

}

function updateModelDropdownS(name,url) {
    $('#modelSelectadd').html(`
    ${url != "none" ? `<img src="${url}" width="150px" loading="lazy">` : ""}
    <h5 class="fw-bold d-inline ms-1">${name}</h5> 
    `)
    $('#modeloSeleccionadoAfter_name').html(`${url}`)
}
function appendDeploymentsMytickets(id,name,model,idp) {
    $(idp).append(`
    <div class="col" id="deploy-card-${id}" role="button" data-bs-toggle="modal" 
    data-bs-target="#relateticketsmodal" data-bs-title="${name}" data-bs-image="${model}">
        <div class="card text-center text-white bg-dark shadow-lg" style="min-height:209px;">
            <div class="card-header">
                <h5 class="fw-bold">Deployment</h5>
            </div>
            <div class="card-body">
                <img src="${model}" width="100%" srcset="">
                <p class="card-text">${name}</p>
            </div>
            <div class="card-footer text-muted">
                something
            </div>
        </div>
    </div>
    `)
}
function addDeployment() {
    $(`#deploymentsList`).append(`
    <div class="col" id="deploy-card-create" role="button" data-bs-toggle="modal" 
    data-bs-target="#addnewDeploymentmodal">
        <div class="card text-center text-white bg-dark shadow-lg " style="min-height:209px;">
            <div class="card-header">
                <h5 class="fw-bold">Deployment</h5>
            </div>
            <div class="card-body d-flex align-items-center justify-content-center">
                <i class="fas fa-plus fa-3x text-light" aria-hidden="true"></i>
            </div>
            <div class="card-footer text-muted">
                <p class="card-text">Create Deploy</p>
            </div>
        </div>
    </div>`)
}

function addDeploymentConfirm() {
    let name = $('#deployNameadd').val();
    let model = $('#modeloSeleccionadoAfter_name').html();
    if(name != "" && model != ""){
        db.run("INSERT INTO deployment (name,model) VALUES (?,?)", [name,model], (err) => {
            if (err) {
                console.log(err);
            }else{
                appendDeploymentsMytickets(0,name,model,"#deploymentsList");
                let myModal = new bootstrap.Modal(document.getElementById('addnewDeploymentmodal'), {
                    keyboard: false
                })
                myModal.hide()
            }
        })
    }else{
        let feedback = "";
        if(name == ""){
            console.log()
            feedback ='Deployment name empty!';
        }else if(model == ""){
            feedback = 'Model not selected!';
        }
        $('#feedbackAlert').html(`
        <div class="alert alert-danger alert-dismissible animate__animated animate__fadeIn" role="alert" id="AlertModalDeploy">
            <i class="fas fa-times-circle"></i> <span>${feedback}</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `);
        setTimeout(() => {
            animateCSS('#AlertModalDeploy','fadeOut').then(() => {
                $('#feedbackAlert').html('')
            })
        }, 2000);
    }
}
function onModalOpen(){
    var relateticketsmodal = document.getElementById('relateticketsmodal')
    relateticketsmodal.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget
        var title = button.getAttribute('data-bs-title')
        var image = button.getAttribute('data-bs-image')
        $('#relateticketsmodalLabel').html(title)
    })
}


document.addEventListener('DOMContentLoaded', function () {
    onModalOpen();
});