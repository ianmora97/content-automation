var g_confluence_deployments = new Array();
var g_tickets_related;


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
var g_user_atlasian = {};
function getCurrentUserAltassian() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: `https://virtuelle-welt.atlassian.net/wiki/rest/api/user/current`,
            contentType: "application/json",
            headers: {
                "Authorization": "Basic " + btoa(json_config.c_email + ":" + json_config.c_token)
            },
        }).then((response) => {
            g_user_atlasian = response;
            resolve("success");
        }, (error) => {
            checkError("currentUser", error.status);
            reject("error");
        });
    });
}

function bringJiraTicketsRelated() {
    $.ajax({
        type: "GET",
        url: `https://virtuelle-welt.atlassian.net/rest/api/3/search?jql=assignee="${g_user_atlasian.publicName}"`,
        contentType: "application/json",
        headers: {
            "Authorization": "Basic " + btoa(json_config.c_email + ":" + json_config.c_token)
        },
    }).then((res) => {
        console.log(`https://virtuelle-welt.atlassian.net/rest/api/3/search?jql=assignee="${g_user_atlasian.publicName}"`,res);
        g_tickets_related = res;
        $('#ticketsRelated').html('');
        res.issues.forEach(e => {
            let flagStatus = e.fields.status.name.match(/approved/gi) != null ? true : false;
            $('#ticketsRelated').append(`
                <li class="list-group-item bg-dark mb-3 rounded-15 p-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h4><span class="me-2" style="font-size:20px;">📥</span> ${e.fields.summary}</h4>
                        <div class="d-flex justify-content-end align-items-center">
                            <img width="30px" height="30px" class="rounded-circle" id="createdBy-${e.id}" src="${e.fields.creator.avatarUrls['48x48']}">
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <p class="mb-1 text-light">
                                <button type="button" class="btn btn-${flagStatus > 0 ? "primary" : "light"} btn-xs">
                                    ${e.fields.status.name}
                                </button>
                            </p>
                            <p class="mb-1"><span class="text-light">${e.fields.priority.name}</span> <img width="16px" height="16px" src="${e.fields.priority.iconUrl}"></p>
                            <div class="d-flex justify-content-between">
                                <h6 class="text-primary mb-0 mt-2" role="button" onclick="openExternalLink('${e.self}')"><u>See Ticket</u></h6>
                            </div>
                        </div>
                        <div class="d-flex flex-column mt-auto">
                            <p class="mb-1"><span class="text-light small">${e.fields.labels.join(", ")}</span></p>
                        </div>
                    </div>
                    
                </li>
            `)
            tippy(`#createdBy-${e.id}`, {
                content: `${e.fields.creator.displayName}`,
                placement: 'top',
                animation: 'shift-away-extreme',
            });
        });
    }, (error) => {
        checkError("deployments", error.status);
    });
}