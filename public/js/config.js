var json_config;
function loadUserConfig(){
    db.get("SELECT * FROM config WHERE id = 1", (err, rows) => {
        if (err) {
            console.log(err);
        }else{
            json_config = rows;
            json_config.c_email = decrypt(rows.c_email);
            json_config.c_token = decrypt(rows.c_token);
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
            if(json_config.c_email != '' && json_config.c_token != ''){
                $('#ticketJiraWarning').remove();
            }
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