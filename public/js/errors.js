var g_alertErrors = 0;
function checkError(type,status){
    g_alertErrors++;
    switch (type) {
        case "modellist":
            _modellistError("Endpoint not found or URL is wrong.",status);
            break;
        case "sitemap":
            _modellistError("Sitemap not loaded.",status);
            break;
        case "deployments":
            _modellistError("Deployments file not found.",status);
            break;
        case "deployment":
            _modellistError("Deployment not found.",status);
            break;
        case "optionsCosy":
            _modellistError("No options found for this model.",status);
            break;
        case "modelnotfound":
            _modellistError("Method not allowed or incorrect NA Code",status);
            break;
        default:
            break;
    }
}

function _modellistError(message,status){
    let err = g_alertErrors;
    $("#feedbackAlert").append(`
        <div class="alert alert-default alert-type-danger alert-dismissible fade show"
        id="alertError${err}" role="alert">
            <div class="alert-content">
                <div class="d-flex justify-content-start">
                    <div class="alert-title">
                        <i class="fas fa-exclamation-triangle" style="font-size:28px;"></i>
                    </div>
                    <div class="alert-body">
                        <strong>Error!</strong> ${message}
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            <div class="progress bg-dark-light" style="height:3.5px;">
                <div class="progress-bar bg-dark" role="progressbar" 
                aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%" id="alert-progress"></div>
            </div>
        </div>`
    );
    animateCSS(`#alertError${err}`,"bounceInLeft").then(()=>{
        let progress = document.getElementById("alert-progress");
        let interval = setInterval(()=>{
            if(progress.style.width === "0%"){
                clearInterval(interval);
                animateCSS(`#alertError${err}`,"bounceOutLeft").then(()=>{
                    $(`#alertError${err}`).remove();
                });
            }else{
                progress.style.width = parseInt(progress.style.width) - 1 + "%";
            }
        },50);
    });
}