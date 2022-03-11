var g_confluence_deployments = new Array();
var g_tickets_related;

function getDataFromAtlassian(){
    destroyTable();
    bringConfluenceContentDeployments();
    bringJiraTicketsRelated();
}
function destroyTable(){
    $('#JiraTable').DataTable().destroy();
}

function bringConfluenceContentDeployments() {
    $.ajax({
        type: "GET",
        url: `https://virtuelle-welt.atlassian.net/wiki/rest/api/content/1874300?expand=body.view`,
        contentType: "application/json",
        headers: {
            "Authorization": "Basic " + btoa(json_config.c_email + ":" + json_config.c_token)
        },
    }).then((res) => {
        searchForDeployments(res)
    }, (error) => {
        checkError("deployments", error.status);
    });
}
async function searchForDeployments(vec) {
    let body = vec.body.view.value;
    let deployTags = body.split('AEMContentReleaseNotes-AEMContentDeployments:')[1].split('<a');
    deployTags.shift();
    deployTags.shift();
    g_confluence_deployments = [];
    for (let i = 0; i < deployTags.length; i++) {
        const e = deployTags[i];
        let id = e.split("data-linked-resource-id=\"")[1].split("\"")[0];
        await fetchContentbyID(id);
    }
    showContentDeployments()
}

function fetchContentbyID(id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: `https://virtuelle-welt.atlassian.net/wiki/rest/api/content/${id}?expand=body.storage,history,version`,
            contentType: "application/json",
            headers: {
                "Authorization": "Basic " + btoa(json_config.c_email + ":" + json_config.c_token)
            },
        }).then((res) => {
            g_confluence_deployments.push(res)
            resolve(res)
        }, (error) => {
            checkError("deployment", error.status);
        });
    });
}
function showContentDeployments(){
    $('#deployments').html('');
    g_confluence_deployments.sort(function (a,b){
        let daA = moment(a.title.split(' ')[0]);
        let daB = moment(b.title.split(' ')[0]);
        return (daA > daB) - (daA < daB);
    })
    .forEach(e => {
        let bodyvalue = e.body.storage.value;
        let _label = bodyvalue.split('labels=aem-content-release')[1];
        let label = "aem-content-release"+_label.split(' ')[0];
        $.ajax({
            type: "GET",
            url: `https://virtuelle-welt.atlassian.net/issues/?jql=labels=${label}&expand=columns`,
            contentType: "application/json",
            headers: {
                "Authorization": "Basic " + btoa(json_config.c_email + ":" + json_config.c_token)
            },
        }).then((res) => {
            let tableRes = res.split(`<table id="issuetable"`)[1].split(`</table>`)[0];
            let _issueRelated = tableRes.split(g_user_atlasian.publicName).length > 1 ? ` - <span role="button" id="infoCircleReleated-${e.id}">🔥</span>` : "";

            let time = bodyvalue.split('Deployment Time:</h3>')[1].split('<p>')[1].split('</p>')[0];
            let date = moment(e.title.split(' ')[0]); 
            let isthesame = e.history.createdBy.profilePicture.path != e.version.by.profilePicture.path;
            $('#deployments').append(`
                <li class="list-group-item bg-dark mb-3 rounded-15 p-3">
                    <div class="d-flex justify-content-between align-items-start">
                        <h4><span class="me-2" style="font-size:20px;">🚀</span> AEM Content Release Notes${_issueRelated}</h4>
                        <div class="d-flex justify-content-end align-items-center">
                            <img width="30px" height="30px" class="rounded-circle" id="createdBy-${e.id}" src="https://virtuelle-welt.atlassian.net${e.history.createdBy.profilePicture.path}">
                            ${isthesame ? `<img width="30px" height="30px" id="updatedBy-${e.id}" class="rounded-circle" src="https://virtuelle-welt.atlassian.net${e.version.by.profilePicture.path}">` : ""}
                        </div>
                    </div>
                    <h4><b class="text-${date.isSame(new Date(), 'day') ? 'success':'warning'}">${date.format('ll')}</b></h4>
                    <p class="text-muted mb-0">Deployment Time: ${time}</p>
                    <div class="d-flex justify-content-between">
                        <h6 class="text-primary mb-0 mt-2" role="button" onclick="openExternalLink('${e._links.base}${e._links.webui}')"><u>See Deployment</u></h6>
                    </div>
                </li>
            `)
            tippy(`#infoCircleReleated-${e.id}`, {
                content: `Currently tickets assigned to me on this Deployment`,
                placement: 'right',
                animation: 'shift-away-extreme',
            });
            tippy(`#createdBy-${e.id}`, {
                content: `${e.history.createdBy.displayName}`,
                placement: 'top',
                animation: 'shift-away-extreme',
            });
            if(isthesame){
                tippy(`#updatedBy-${e.id}`, {
                    content: `${e.version.by.displayName}`,
                    placement: 'top',
                    animation: 'shift-away-extreme',
                });
            }
        }, (error) => {
            checkError("deployment", error.status);
        });
    });
}


function bringJiraTicketsRelated() {
    $.ajax({
        type: "GET",
        url: `https://virtuelle-welt.atlassian.net/rest/api/3/search?jql=assignee=${g_user_atlasian.publicName} AND status!=Closed order by key DESC&startAt=0&maxResults=100&&fields=assignee,status,summary,priority,creator&fields=assignee,status,summary,priority,creator`,
        contentType: "application/json",
        headers: {
            "Authorization": "Basic " + btoa(json_config.c_email + ":" + json_config.c_token)
        },
    }).then((res) => {
        g_tickets_related = res;
        getAllJiraStatus();
        bringJiraTicketsRelatedShow(res.issues);
    }, (error) => {
        checkError("deployments", error.status);
    });
}
function bringJiraTicketsRelatedShow(tickets){
    $('#ticketsRelated').html('');
    tickets.forEach(e => {
        let flagStatus = e.fields.status.name.match(/approved/gi) != null ? "success" : "light";
        flagStatus = e.fields.status.name.match(/failed/gi) != null ? "danger" : flagStatus;
        $('#ticketsRelated').append(`
            <tr>
                <td><div class="breakTitle" id="title-Jira-table-${e.id}"><i class="fa-brands fa-jira text-primary pe-2"></i> ${e.key} - ${e.fields.summary}</div></td>
                <td>
                    <button type="button" class="btn btn-${flagStatus} btn-xs w-100">
                        ${e.fields.status.name}
                    </button>
                </td>
                <td><span class="visually-hidden-focusable">${e.fields.priority.name}</span><img width="16px" height="16px" src="${e.fields.priority.iconUrl}"></td>
                <td><span class="visually-hidden-focusable">${e.fields.creator.displayName}</span><img width="30px" height="30px" class="rounded-circle" id="createdBy-${e.id}" src="${e.fields.creator.avatarUrls['48x48']}"></td>
                <td><p class="btn btn-xs btn-primary mb-0 mt-2" role="button" onclick="openExternalLink('https://virtuelle-welt.atlassian.net/browse/${e.key}')"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open</p></td>
            </tr>
        `)
        tippy(`#createdBy-${e.id}`, {
            content: `${e.fields.creator.displayName}`,
            placement: 'top',
            animation: 'shift-away-extreme',
        });
        tippy(`#title-Jira-table-${e.id}`, {
            content: `${e.fields.summary}`,
            placement: 'top',
            animation: 'shift-away-extreme',
        });

    });
    $('#JiraTable').DataTable({
        responsive: false,
        "paging": true,
        "info": true,
        "searching": true,
        "language": {
            "lengthMenu": "_MENU_" ,
            "paginate": {
                "first": '<i class="fas fa-angle-double-left"></i>',
                "previous": '<i class="fas fa-angle-left"></i>',
                "next": '<i class="fas fa-angle-right"></i>',
                "last": '<i class="fas fa-angle-double-right"></i>'
            },
            "aria": {
                "paginate": {
                    "first": '<i class="fas fa-angle-double-left"></i>',
                    "previous": '<i class="fas fa-angle-left"></i>',
                    "next": '<i class="fas fa-angle-right"></i>',
                    "last": '<i class="fas fa-angle-double-right"></i>'
                }
            }
        },
        "order": [[ 1, "desc" ]],
        "columnDefs": [
            { "orderable": false, "targets": [3,4] },
        ],
    });
    $('#lengthJiraTable').html('');
    $('#infoJiraTable').html('');
    $('#paginationJiraTable').html('');
    
    $('#JiraTable_wrapper').addClass('px-0')
    let a = $('#JiraTable_wrapper').find('.row')[1];
    $(a).addClass('mx-0')
    $(a).find('.col-sm-12').addClass('px-0');

    $('#JiraTable_filter').css('display', 'none');

    $('#JiraTable_length').find('label').find('select').addClass("bg-dark-light");
    $('#JiraTable_length').find('label').appendTo('#lengthJiraTable');
    $('#table_length').html('');

    $('#JiraTable_info').appendTo('#infoJiraTable');
    $('#JiraTable_paginate').appendTo('#paginationJiraTable');
}
var g_allJira_status = new Array();
function getAllJiraStatus(){
    $.ajax({
        type: "GET",
        url: `https://virtuelle-welt.atlassian.net/rest/api/3/status`,
        contentType: "application/json",
        headers: {
            "Authorization": "Basic " + btoa(json_config.c_email + ":" + json_config.c_token)
        },
    }).then((response) => {
        g_allJira_status = response;
        getAllJiraStatusShow(response);
    }, (error) => {
        checkError("jirastatus", error.status);
    });
}
function getAllJiraStatusShow(status){
    $("#ulJirastatusLis").html('');
    $("#ulJirastatusLis").append(`<li class="dropdown-item" onclick="jiraStatusFilter('all')">All</li>`);
    status.forEach(e =>{
        $("#ulJirastatusLis").append(`
            <li role="button" class="dropdown-item" onclick="jiraStatusFilter('${e.name}')">${e.name}</li>
        `);
    });
}
function searchonKeyUpJiraTickets() {
    var table = $('#JiraTable').DataTable();
    let val = $('#searchTicketsonTable').val();
    let result = table.search(val).draw();
}
function jiraStatusFilter(name){
    $("#jira-status-label").html(name);
    var table = $('#JiraTable').DataTable();
    if(name == "all"){
        let result = table.search("").draw();
    }else{
        let result = table.search(name).draw();
    }
}
function formSerachonstatus(){
    $('#ulJirastatusList-input').on('keyup',function(e){
        e.preventDefault();
        let status = $('#ulJirastatusList-input').val();
        let reg = new RegExp(status, 'gi');
        let ticket = g_allJira_status.filter(e => e.name.match(reg) != null);
        getAllJiraStatusShow(ticket);
    });
}
function checksend(){
    $("#ulJirastatusList-form").submit(function(e) {
        e.preventDefault();
    });
}
var ticketsRelated_temp = new Array();
function ticketsRelatedInterval(){ // for interval
    $.ajax({
        type: "GET",
        url: `https://virtuelle-welt.atlassian.net/rest/api/3/search?jql=assignee=${g_user_atlasian.publicName} AND status!=Closed order by key DESC&startAt=0&maxResults=100&fields=assignee,status,summary,priority,creator`,
        contentType: "application/json",
        headers: {
            "Authorization": "Basic " + btoa(json_config.c_email + ":" + json_config.c_token)
        },
    }).then((res) => {
        let arr_a = [...g_tickets_related.issues];
        let arr_b = [...res.issues];
        ticketsRelated_temp = _.differenceWith(arr_a, arr_b, _.isEqual);
        // (a,b) =>{
        //     return a.fields.status.name == b.fields.status.name;
        // }
        console.log(ticketsRelated_temp.length)
        g_tickets_related = res;
        showJiraNotifications(ticketsRelated_temp);
    }, (error) => {
    });
}
function showJiraNotifications(newTicket){
    if(newTicket.length > 0){
        let title = newTicket[0].key;
        let subtitle = newTicket[0].fields.summary;
        let body = `Status: ${newTicket[0].fields.status.name}`;
        let sound = "sounds/default.mp3";
        if(newTicket[0].fields.status.name.match(/approved|done|closed/gi) != null){
            sound = 'sounds/success.mp3';
        }
        let args = {
            title: title,
            subtitle: subtitle,
            body: body,
            silent: true,
            urgency: 'critical',
            sound: sound,
            closeButtonText: 'Close Button',
            icon: 'jiraLogo.png',
            actions: [ {
                type: 'button',
                text: 'Show Button'
            }]
        }
        sendNotificationJira({args: args, url: `https://virtuelle-welt.atlassian.net/browse/${title}`});
    }
}
function getNotifications(){
    // TODO: Get notifications every 5 min.
    let inter = setInterval(() => {
        ticketsRelatedInterval();
        console.log("INTERVAL")
    },10000);
}

document.addEventListener("DOMContentLoaded", function(event) {
    checksend();
    formSerachonstatus();
    getNotifications();
});