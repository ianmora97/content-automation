const fs = require('fs');
var jsonpath = 'public/js/config.json';

var json_config;
function loadUserConfig(){
    json_config = JSON.parse(fs.readFileSync(jsonpath).toString());
}
loadUserConfig()

function setConfigJsonJira(){
    let m = {
        c_email: $('#emailJira').val(),
        c_token: $('#jiraToken').val()
    }
    fs.writeFileSync(jsonpath, JSON.stringify(m));
    $('#validateButtonIcon').addClass('fa-spinner fa-pulse');
    setTimeout(() => {
        $('#validateButtonIcon').removeClass('fa-spinner fa-pulse').addClass('fa-check-circle');
        $('#validateButton').removeClass('btn-primary').addClass('btn-success');
        $('#validateButton').find('span').text('Saved')
        setTimeout(() => {
            $('#validateButton').removeClass('btn-success').addClass('btn-primary');
            $('#validateButton').find('span').text('Save')
            $('#validateButtonIcon').removeClass('fa-check-circle')
            loadUserConfig()
        }, 1000);
    }, 2000);
}
var gt_ticket = {};
function bringJiraTicket(cont){
    $.ajax({
        type: "GET",
        url: 'https://virtuelle-welt.atlassian.net/rest/agile/1.0/issue/'+cont,
        contentType: "application/json",
        headers: {
            "Authorization": "Basic " + btoa(json_config.c_email + ":" + json_config.c_token)
        },
    }).then((response) => {
        let release = response.fields.labels.filter(e=> e.match('release'))[0]
        release = release.slice(release.length - 8,release.length).replace(/\./g, '/');
        gt_ticket = {
            code: response.key.split('-')[1],
            name: response.fields.summary,
            status: response.fields.status.name,
            priority: response.fields.priority.name,
            release: release,
        }
        $('#ticketBackResponse').html('');
        showTicketResponse(gt_ticket)
    }, (error) => {
        if(error.status == 404){
            $('#ticketAddModal').attr('placeholder', 'Ticket Not found').val('');
            setTimeout(() => {
                $('#ticketAddModal').attr('placeholder', 'Search ticket').focus();
            }, 1000);
        }
    });
}
async function bringJiraTicketAsync(cont){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: 'https://virtuelle-welt.atlassian.net/rest/agile/1.0/issue/'+cont,
            contentType: "application/json",
            headers: {
                "Authorization": "Basic " + btoa(json_config.c_email + ":" + json_config.c_token)
            },
        }).then((response) => {
            let release = response.fields.labels.filter(e=> e.match('release'))[0]
            release = release.slice(release.length - 8,release.length).replace(/\./g, '/');
            gt_ticket = {
                code: response.key.split('-')[1],
                name: response.fields.summary,
                status: response.fields.status.name,
                priority: response.fields.priority.name,
                release: release,
            }
            resolve(gt_ticket)
        }, (error) => {
            if(error.status == 404){
                reject(error)
                $('#ticketAddModal').attr('placeholder', 'Ticket Not found').val('');
                setTimeout(() => {
                    $('#ticketAddModal').attr('placeholder', 'Search ticket').focus();
                }, 1000);
            }
        });
    })
}
function showTicketResponse(ticket){
    $('#ticketBackResponse').append(`
    <div class="d-flex justify-content-between">
        <h5 class="mb-2 btn-to-clip" role="button" data-clipboard-text="CONT-${ticket.code}">CONT-${ticket.code}</h5>
            <button class="btn btn-sm btn-danger" data-bs-dismiss="modal" onclick="addTickettoDB('${ticket.code}','${ticket.name}','${ticket.priority}','${ticket.release}')">
            <i class="fas fa-folder-plus"></i> Add Ticket</button>
    </div>
    <hr>
    <p class="mb-0"><h6>Name:</h6> <i class="fas fa-circle text-primary" style="font-size:10px;"></i>
     <u>${ticket.name}</u></p>
    <p class="mb-0"><h6>Status:</h6> <span class="badge bg-primary">${ticket.status}</span></p>
    <p class="mb-0"><h6>Priority:</h6> <i class="fas fa-circle text-primary" style="font-size:10px;"></i>
     <u>${ticket.priority}</u></p>
    <p class="mb-0"><h6>Release:</h6> <i class="fas fa-circle text-primary" style="font-size:10px;"></i>
     <u>${ticket.release}</u></p>
    <hr>
    <p class="text-light m-0 fw-light small">Version:</p>
    <div role="button" class="jiraTicketVersion mb-3 btn-to-clip user-select-all" data-clipboard-text="CONT-${ticket.code} - ${ticket.name}"
    data-bs-toggle="tooltip" data-bs-placement="top" title="Copy to Clipboard" >
        CONT-${ticket.code} - ${ticket.name}
    </div>
    <p class="text-light m-0 fw-light small">Workflow:</p>
    <div role="button" class="jiraTicketWorkflow btn-to-clip user-select-all" data-clipboard-text="CONT-${ticket.code} - ${ticket.name}"
    data-bs-toggle="tooltip" data-bs-placement="top" title="Copy to Clipboard" >
        CONT-${ticket.code} - ${ticket.name}
    </div>
    `);
    enableTooltips();

}

function findTicketAdd(){
    $('#ticketAddModal').on('keyup',function(event){
        if(event.keyCode == 13){
            let val = $('#ticketAddModal').val();
            if(val.match('CONT')){
                bringJiraTicket(val);
                $('#ticketAddModal').val('');
                $('#ticketAddModal').blur();
                $('#ticketAddModal').attr('placeholder', 'Searching...');
                setTimeout(() => {
                    $('#ticketAddModal').attr('placeholder', 'Search ticket');
                    $('#ticketAddModal').focus();
                }, 1000);
            }else{
                val = "CONT-"+val
                bringJiraTicket(val);
                $('#ticketAddModal').val('');
                $('#ticketAddModal').blur();
                $('#ticketAddModal').attr('placeholder', 'Searching...');
                setTimeout(() => {
                    $('#ticketAddModal').attr('placeholder', 'Search ticket');
                    $('#ticketAddModal').focus();
                }, 1000);
            }
        }
    })
    
}

function addTickettoDB(code, name, priority, release){
    db.run("INSERT INTO ticket_l (code, priority, release) VALUES (?,?,?)", [code, priority, release], (err) => {
        if (err) {
            console.log(err);
        }else{
            appendtoTicketList(gt_ticket,"#ticketsList");
           
        }
    })
}
function clearTicketsList(){
    $('#ticketsList').html('');
}
function printTicketList(){
    clearTicketsList();
    bringTickets()
}
function bringTickets(){
    db.all("SELECT * FROM v_tickets", (err, rows) => {
        if (err) {
            console.log(err)
        }
        rows.forEach((row) => {
            appendtoTicketListD(row,"#ticketsList");
        });
    }).all("SELECT * FROM v_ticketsl", (err, rows) => {
        if (err) {
            console.log(err)
        }
        rows.forEach((row) => {
            appendtoTicketList(row,"#ticketsList");
        });
    });
}
var g_Tickets = new Array();
var g_mapTickets = new Map();

function appendtoTicketList(ticket,id) {
    bringJiraTicketAsync(`CONT-${ticket.code}`).then((e) => {
        g_Tickets.push(e);
        g_mapTickets.set(e.code, e);
        printTickettoList(ticket,e,id);
    })
}
function printTickettoList(ticket,e,id){
    $(id).append(`
        <div class="p-2 bg-dark mb-2" id="cont-id-${ticket.code}">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex justify-content-start align-items-center">
                    <i class="fab fa-jira text-primary pe-3 ps-2"></i>
                    <h6 class="mb-0">${e.name}</h6>
                </div>
                <div class="d-flex justify-content-end align-items-center">
                    <h5 class="me-2 mb-0"><span class="badge bg-${e.status == "Closed" ? 'success' : 'primary' }">${e.status}</span></h5>
                    ${e.status == "Closed" ? `<button class="btn btn-xs btn-outline-danger" onclick="deleteTicket('#cont-id-${ticket.code}','non-deploy')"><i class="fas fa-trash-alt"></i></button>` : ''}
                </div>
            </div>
        </div>
    `);
}
function appendtoTicketListD(ticket,id) {
    bringJiraTicketAsync(`CONT-${ticket.code}`).then((e) => {
        g_Tickets.push(e);
        g_mapTickets.set(e.code, e);
        $(id).append(`
            <div class="p-2 bg-dark mb-2" data-deploy="${ticket.deploy}" id="cont-id-${ticket.code}">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex justify-content-start align-items-center">
                        <i class="fab fa-jira text-primary pe-3 ps-2"></i>
                        <h6 class="mb-0">${e.name}</h6>
                    </div>
                    <div class="d-flex justify-content-end align-items-center">
                        <h5 class="me-2 mb-0"><span class="badge bg-${e.status == "Closed" ? 'success' : 'primary' }">${e.status}</span></h5>
                        ${e.status == "Closed" ? `<button class="btn btn-xs btn-outline-danger" onclick="deleteTicket('#cont-id-${ticket.code}','deploy')"><i class="fas fa-trash-alt"></i></button>` : ''}
                    </div>
                </div>
            </div>
        `);
    })
}
function deleteTicket(id,type){
    let code = $(id).attr('id').split('-')[2];
    if(type == "deploy"){
        db.run("DELETE FROM ticket_d WHERE code = ?", [code], (err) => {
            if (err) {
                console.log(err);
            }else{
                $(id).remove();
            }
        })
    }else{
        db.run("DELETE FROM ticket_l WHERE code = ?", [code], (err) => {
            if (err) {
                console.log(err);
            }else{
                $(id).remove();
            }
        })

    }

}



document.addEventListener('DOMContentLoaded', function() {
    findTicketAdd();
    printTicketList();
});