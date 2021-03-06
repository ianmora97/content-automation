/**
 * @param json_config personal Configuration
 */
var json_config;
/**
 * @param cosy_config cosy domains list Configuration
 */
var cosy_config;
async function loadUserConfig(){
    db.get("SELECT * FROM config WHERE id = 1", (err, rows) => {
        if (err) {
            console.log(err);
        }else{
            // TODO: decrypt the email and token
            json_config = rows;
            json_config.c_email = decrypt(rows.c_email);
            json_config.c_token = decrypt(rows.c_token);

            // TODO: Fill 2 years between today's Year
            let lo_year = parseInt(new Date().getFullYear().toString().slice(2,4));
            let lo_vecYears = new Array();
            lo_vecYears.push(lo_year);
            for(let i = 1; i < 3; i++){lo_vecYears.push(lo_year - i, lo_year + i)}
            lo_vecYears
            .sort(function(a,b){if(a>b)return -1;return 0})
            .forEach(e => {
                $('#cosyYear').append(`
                    <option value="${e}" ${json_config.p_year == e ? 'selected':''}>${e}</option>`
                );
            });

            // TODO: Check email and token if exists on DB
            if(json_config.c_email != '' && json_config.c_token != ''){
                $('#ticketJiraWarning').remove();
            }
            getCurrentUserAltassian().then(res => {
                bringConfluenceContentDeployments();
                bringJiraTicketsRelated();
            });
        }
    });
}
loadUserConfig()
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
function setCondigJsonCosyYear(se){
    json_config.p_year = $(se).val();
    db.run(`UPDATE config set p_year = ? WHERE id = 1`, 
    [json_config.p_year], function(err) {
        if (err) {
            console.log(err.message);
        }else{
            console.log(`%c Year has been updated`,'background: #222; color: #bada55');
        }
    });
    getAllModelsList()
}

function setConfigJsonJira(){
    let m = {
        c_email: encrypt($('#emailJira').val()),
        c_token: encrypt($('#jiraToken').val())
    }
    db.run(`UPDATE config set c_email = ?, c_token = ? WHERE id = 1`, 
    [m.c_email, m.c_token], function(err) {
        if (err) {
            console.log(err.message);
        }else{
            console.log(`%c Email and Token have been updated`,'background: #222; color: #bada55');
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
    });
    
}
function getCosyConfig(params) {
    db.get("SELECT * FROM cosyConfig WHERE id = 1", (err, rows) => {
        if (err) {
            console.log(err);
        }else{
            // TODO: decrypt all the cosy urls
            cosy_config = rows;
            cosy_config.domain = decrypt(rows.domain);
            cosy_config.ubyo = decrypt(rows.ubyo_start);

            $('#cosyDomain').val(cosy_config.domain);
            $('#cosyStart').val(cosy_config.ubyo);

            getAllModelsList();
        }
    });
}
getCosyConfig()

function setConfigCosyJira(){
    let m = {
        domain: encrypt($('#cosyDomain').val()),
        start: encrypt($('#cosyStart').val())
    }
    db.run(`UPDATE cosyConfig set domain = ?, ubyo_start = ? WHERE id = 1`, 
    [m.domain, m.start], function(err) {
        if (err) {
            console.log(err.message);
        }else{
            console.log(`%cCosy Configurations updated`,'background: #222; color: #bada55');
            $('#validateButtonCosyIcon').addClass('fa-spinner fa-pulse');
            setTimeout(() => {
                $('#validateButtonCosyIcon').removeClass('fa-spinner fa-pulse').addClass('fa-check-circle');
                $('#validateButtonCosy').removeClass('btn-primary').addClass('btn-success');
                $('#validateButtonCosy').find('span').text('Saved')
                setTimeout(() => {
                    $('#validateButtonCosy').removeClass('btn-success').addClass('btn-primary');
                    $('#validateButtonCosy').find('span').text('Save')
                    $('#validateButtonCosyIcon').removeClass('fa-check-circle')
                    getCosyConfig()
                }, 1000);
            }, 2000);
        }
    });
}