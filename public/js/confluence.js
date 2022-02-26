var g_confluence_deployments = new Array();

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
        await fetchContentbyID(e.split("data-linked-resource-id=\"")[1].split("\"")[0]);
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
        let time = bodyvalue.split('Deployment Time:</h3>')[1].split('<p>')[1].split('</p>')[0];
        let date = moment(e.title.split(' ')[0]);
        let isthesame = e.history.createdBy.profilePicture.path != e.version.by.profilePicture.path;
        $('#deployments').append(`
            <li class="list-group-item bg-dark mb-3 rounded-15 p-3">
                <div class="d-flex justify-content-between align-items-start">
                    <h4><span class="me-2" style="font-size:20px;">🚀</span> AEM Content Release Notes</h4>
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
    });
}