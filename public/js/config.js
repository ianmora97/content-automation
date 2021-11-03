/**
 * @param json_config personal Configuration
 */
var json_config;
/**
 * @param cosy_config cosy domains list Configuration
 */
var cosy_config;
function loadUserConfig(){
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
            bringConfluenceContentDeployments()
        }
    });
}
loadUserConfig()

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
            cosy_config.ubyo_start = decrypt(rows.ubyo_start);
            cosy_config.ubyo_options = decrypt(rows.ubyo_options);
            cosy_config.ubyo_modelList = decrypt(rows.ubyo_modelList);
            cosy_config.ubyo_specs = decrypt(rows.ubyo_specs);

            $('#cosyDomain').val(cosy_config.domain);
            $('#cosyModelList').val(cosy_config.ubyo_modelList);
            $('#cosyStart').val(cosy_config.ubyo_start);
            $('#cosyOptions').val(cosy_config.ubyo_options);
            $('#techspecsApi').val(cosy_config.ubyo_specs);

            getAllModelsList();
        }
    });
}
getCosyConfig()

function setConfigCosyJira(){
    let m = {
        domain: encrypt($('#cosyDomain').val()),
        modellist: encrypt($('#cosyModelList').val()),
        start: encrypt($('#cosyStart').val()),
        options: encrypt($('#cosyOptions').val()),
        specs: encrypt($('#techspecsApi').val())
    }
    db.run(`UPDATE cosyConfig set domain = ?, ubyo_modelList = ?, ubyo_start = ?, ubyo_options = ?, ubyo_specs = ? WHERE id = 1`, 
    [m.domain, m.modellist, m.start, m.options, m.specs], function(err) {
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