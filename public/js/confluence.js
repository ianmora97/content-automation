
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
    
    });
}
function searchForDeployments(vec) {
    let body = vec.body.view.value;
    console.log('CONFLUENCE', body)
    let deployTags = body.split('AEMContentReleaseNotes-AEMContentDeployments:')[1].split('<a');
    deployTags.shift();
    deployTags.shift();

    deployTags.forEach(e => {
        showContentDeployments(e.split("data-linked-resource-id=\"")[1].split("\"")[0]);
    });
}

function showContentDeployments(id) {
    console.log('ID', id)
    $.ajax({
        type: "GET",
        url: `https://virtuelle-welt.atlassian.net/wiki/rest/api/content/${id}`,
        contentType: "application/json",
        headers: {
            "Authorization": "Basic " + btoa(json_config.c_email + ":" + json_config.c_token)
        },
    }).then((res) => {
        let titleD = res.title.split(' ')[0]
        let date = moment(titleD);
        $('#deployments').append(`
            <li class="list-group-item bg-dark mb-3 rounded-15">
                <div class="d-flex justify-content-start align-items-center">
                    <span class="d-block me-2" style="font-size:20px;">🚀</span>
                    <h4>AEM Content Release Notes</h4>
                </div>
                <h4><b class="text-${date.isSame(new Date(), 'day') ? 'success':'secondary'}">${date.format('ll')}</b></h4>
                <p>Created by: <span class="badge bg-primary">${res.history.createdBy.publicName}</span></p>
                <h6 class="text-primary" role="button" onclick="openExternalLink('${res._links.base}${res._links.webui}')"><u>See Deployment</u></h6>
            </li>
        `)
    }, (error) => {
    
    });
}