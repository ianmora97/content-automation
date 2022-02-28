var sqlite3 = require("sqlite3").verbose();
const path = require('path');

let db = new sqlite3.Database(path.join(__dirname,'../db/database.db'), (err) => {
    if (err) {
        if(err.message.includes("SQLITE_CANTOPEN")){
            console.log("SQLite not found");
        }
        return;
    }else{
        getMacos();
        getMacosbyRegion();
        bringDeployments();
        addDeployment()
        
        console.log(`%cSQLite Connected`,'background: #222; color: #bada55');
    }
});
var g_modelList = new Array();

function getAllModelsList() {
    clearSpaces();
    clearSpacesWP();
    $.ajax({
        type: "GET",
        url: `${cosy_config.ubyo}/v1/static/BM/modellist?loadtype=full`,
        contentType: "application/json",
    }).then((response) => {
        g_modelList = response;
        loadDataListInput(response);
    }, (error) => {
        checkError("modellist", error.status);
    });
}

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
                fillLoadLinksforCopy();
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
function fillLoadLinksforCopy(){
    g_Macos.forEach((maco) => {
        loadLinkstoCopyonOffers(maco);
    })
}
function loadLinkstoCopyonOffers(maco){
    $(`#${maco.region_name}-OffersLinks-Staging`).append(`https://www.staging.bmwusacm.co/home.html?maco=${maco.code}<br>`);
    $(`#${maco.region_name}-OffersLinks-Prod`).append(`https://www.prod.bmwusacm.co/home.html?maco=${maco.code}<br>`);
    $(`#${maco.region_name}-OffersLinks-Live`).append(`https://www.bmwusa.com/home.html?maco=${maco.code}<br>`);
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
    data-bs-target="#relateticketsmodal" data-bs-id="${id}" data-bs-title="${name}" data-bs-image="${model}">
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
        $('#deploymentticketsList').html('');
        $('#nondeploymentticketsList').html('');
        var button = event.relatedTarget
        var title = button.getAttribute('data-bs-title')
        var image = button.getAttribute('data-bs-image')
        var id = button.getAttribute('data-bs-id')
        $('#relateticketsmodalLabel').html(title);
        $('#deploymentticketsList').html();
        let ticketsFromDeploy = getallTicketsByDeployment(id);
        let ticketsFromNonDeploy = getallTicketsByNonDeployment(id);
        ticketsFromDeploy.forEach((ticket) => {
            $('#deploymentticketsList').append(`
            <div class="p-2 bg-dark mb-2" id="deploy-cont-${ticket.code}">
                <div class="d-flex justify-content-start align-items-center">
                    <i class="fab fa-jira text-primary pe-3 ps-2"></i>
                    <h6 class="mb-0">${ticket.name}</h6>
                </div>
            </div>
            `)
        })
        ticketsFromNonDeploy.forEach((ticket) => {
            $('#nondeploymentticketsList').append(`
            <div class="p-2 bg-dark mb-2 draggable drag-drop dragTicketNonDeploy" id="deploy-cont-${ticket.code}">
                <div class="d-flex justify-content-start align-items-center">
                    <i class="fab fa-jira text-primary pe-3 ps-2"></i>
                    <h6 class="mb-0">${ticket.name}</h6>
                </div>
            </div>
            `)
        })
    })
}
function getallTicketsByNonDeployment(id){
    return g_Tickets.filter(ticket => ticket.deploy == null);
}
function getallTicketsByDeployment(id) {
    return g_Tickets.filter(ticket => ticket.deploy == id);
}
function loadTicketsonModalDeploymentDrag(){
    interact('.draggable').draggable({
        inertia: true,
        autoScroll: true,
        onmove: dragMoveListener,
        onend: function (event) {
        }
        
    });
    interact('.dropzone').dropzone({
        accept: '.dragTicketNonDeploy',
        overlap: 0.80,
        ondropactivate: function (event) {
            event.target.classList.add('drop-active');
        },
        ondragenter: function (event) {
            var draggableElement = event.relatedTarget,
                dropzoneElement = event.target;
        
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
            //draggableElement.textContent = 'le bloc est dedans';
        },
        ondragleave: function (event) {
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
            event.relatedTarget.classList.remove('drop-ok');//enlever la class
        },
        ondrop: function (event) {
            event.relatedTarget.classList.add('drop-ok');
            event.relatedTarget.remove()
            moveTicketToTicketDeploy(event.relatedTarget.id);
        },
        ondropdeactivate: function (event) {
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
      });
}
function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}
function moveTicketToTicketDeploy(ticket) {
    let ticketId = ticket.split('-')[2];
    let ticketName = g_Tickets.find(ticket => ticket.code == ticketId);
    $('#deploymentticketsList').append(`
    <div class="p-2 bg-dark mb-2" id="deploy-cont-${ticketName.code}">
        <div class="d-flex justify-content-start align-items-center">
            <i class="fab fa-jira text-primary pe-3 ps-2"></i>
            <h6 class="mb-0">${ticketName.name}</h6>
        </div>
    </div>
    `)
}



document.addEventListener('DOMContentLoaded', function () {
    // onModalOpen();
    // loadTicketsonModalDeploymentDrag();
});