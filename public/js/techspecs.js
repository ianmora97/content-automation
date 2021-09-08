function techEvents(event) {
    askInputTechSpecs()
    getAllModelsList();
    bringKeyValuesTechSpecs()
    onSelectTechValueChange();
    onSearchTemplatesModels()
}

function askInputTechSpecs() {
    $('#naCodeModelTech').on('change', function(event) {
        let val = $('#naCodeModelTech').val();
        getTechSpecsApi(val);
    });
}
function validateModel(json) {
    if(json.name.match(/(X[1-7])/g)){ //modelo X
        console.log('X Model')
    }else if(json.name.match(/(M[2-8])/g)){ // Modelo M
        console.log('M Model')
    }else if(json.name.match(/(i[3])/g)){ // i3
        console.log('i3 Model')
    }else if(json.name.match(/(iX)/g)){ // iX
        console.log('iX Model')
    }else if(json.name.match(/(i[4-7])/g)){ // i4-7
        console.log('i4-7 Model')
    }
}
function getTechSpecsApi(model) {
    $.ajax({
        type: "GET",
        url: 'https://qa.configure.bmwusa.com/UBYOConfigurator/v4/BM/techspecs/'+model,
        contentType: "application/json",
    }).then((response) => {
        printNaCodeSpecs(response,model)
    }, (error) => {
    
    });
}
async function getTechSpecsApiV2(model){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: "GET",
            url: 'https://qa.configure.bmwusa.com/UBYOConfigurator/v4/BM/techspecs/'+model,
            contentType: "application/json",
        }).then((response) => {
            resolve(response);
        }, (error) => {
            reject(error)
        });
    })
}
function printNaCodeSpecs(model,code){
    $('#techSpecsfromNaCode').html('')
    let template = g_mapTemplates_techspecs.get(code);
    console.log(template, code, model)
    if(template != undefined){
        if(template.name == "SAV"){ //SAV Template
            $('#techSpecsfromNaCode').html(template_SAV(model))
        }else if(template.name == "SEDAN"){ // Modelo M
            $('#techSpecsfromNaCode').html(template_SEDAN(model))
        }
    }else{
        $('#techSpecsfromNaCode').html('')
    }
}
function iterateOverObjectTech(obj, stack) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (typeof obj[property] == "object") {
                iterateOverObjectTech(obj[property], stack + '.' + property);
            } else {
                $('#techSpecsfromNaCode').append(`
                    <p>
                        <span class="text-light">${property}</span><br>
                        <span class="fw-bold">${obj[property]}</span>
                    </p>
                `)
            }
        }
    }
}
function loadDataListInput(list){
    list.forEach(element => {
        fillDataList(element)
    });
}
function fillDataList(model){
    $('#naCodeModelTech').append(`<option value="${model.code}">${model.code} ${model.name}</option>`)
}
function showEngineType(models) {
    models.forEach(model => {
        if(model.name.match(/(X[1-7])/g)){
            if(model.code != '22SU'){
                if(model.code != '22ST'){
                    $.ajax({
                        type: "GET",
                        url: 'https://qa.configure.bmwusa.com/UBYOConfigurator/v4/BM/techspecs/'+model.code,
                        contentType: "application/json",
                    }).then((response) => {
                        let text = response.hasOwnProperty();
                        if(text == 'undefined'){
                            console.info(`%c ${model.code} - ${response.name}`, 'background: #222; color: #ff0000');
                        }
                    }, (error) => {
                    });
                }
            }
        }
    })
}

var g_modelList = {};
function getAllModelsList() {
    $.ajax({
        type: "GET",
        url: 'https://configure.bmwusa.com/UBYOConfigurator/v1/static/BM/modellist?loadtype=full',
        contentType: "application/json",
    }).then((response) => {
        g_modelList = response;
        loadDataListInput(response);
    }, (error) => {
    
    });
}
var g_techValues = new Array()
var g_mapTechValues = new Map()
var g_templates_techspecs = new Array()
var g_mapTemplates_techspecs = new Map()
var g_setTemplatesNames = new Set()

function bringKeyValuesTechSpecs(){
    db.serialize(() => {
        db.all("SELECT * FROM v_prop", [], (err, rows) => {
            if (err) {
                console.log(err);
            }else{
                rows.forEach((row) => {
                    g_techValues.push(row);
                    g_mapTechValues.set(row.key, row);
                    appendTechValueSelect(`#keyvalueModelTech`,row)
                });
            }
        }).all("SELECT * FROM template", [], (err, rows) => {
            if (err) {
                console.log(err);
            }else{
                rows.forEach((row) => {
                    appendTemplatesTabs(row)
                });
            }
        }).all("SELECT * FROM v_variations", [], (err, rows) => {
            if (err) {
                console.log(err);
            }else{
                rows.forEach((row) => {
                    g_templates_techspecs.push(row);
                    g_setTemplatesNames.add(row.name)
                    g_mapTemplates_techspecs.set(row.nacode, row);
                    bringConfigSulzer(row,row.nacode)
                });
            }
        });
    });
}
var g_mapModelConfigSS = new Map();
var g_contTemplatesTabs = 0;
function bringConfigSulzer(row,model){
    let json = json_config;
    appendTemplatesModelstoTabs(row,json.fav_view)
    // ! temp until alpha
    // $.ajax({
    //     type: "GET",
    //     url: 'https://configure.bmwusa.com/UBYOConfigurator/v1/configuration/start/'+model,
    //     contentType: "application/json",
    // }).then((response) => {
    //     g_mapModelConfigSS.set(model, response)
        
    // }, (error) => {
    
    // });
}
async function clearTemplatesView() {
    return new Promise((resolve, reject) => {
        let cont = 0;
        g_setTemplatesNames.forEach(row => {
            $(`#v-listTemplates-${row}`).html('')
            cont++;
            if(cont == g_setTemplatesNames.size){
                resolve('done')
            }
        });
    });
}
function changeViewTemplatesBtn(view){
    let json = JSON.parse(fs.readFileSync(jsonpath).toString());
    json.fav_view = view;
    fs.writeFileSync(jsonpath, JSON.stringify(json));
    clearTemplatesView().then((d) => {
        g_templates_techspecs.forEach((row) => {
            appendTemplatesModelstoTabs(row,view)
        });
    });
}

function appendTemplatesTabs(row) { // ! hacer un mostrar como card o lista en los tabpanes y poner un titulo 
    if(g_contTemplatesTabs == 0){
        $('#v-templates-tabContent').append(`
            <div class="tab-pane fade active show " id="v-listTemplates-${row.name}-tab" 
            role="tabpanel" aria-labelledby="v-listTemplates-${row.name}-tab">
                <div class="d-flex flex-wrap border-end border-dark-light pe-1" id="v-listTemplates-${row.name}">
                </div>
            </div>
        `);
        $('#v-templateslist-tab').append(`
            <button class="nav-link active" id="v-listTemplates-${row.name}-tab" data-bs-toggle="pill" data-bs-target="#v-listTemplates-${row.name}-tab" 
            type="button" role="tab" aria-controls="v-listTemplates-${row.name}-tab" aria-selected="true"><i class="fas fa-clone pe-2"></i> ${row.name}</button>
        `)
    }else{
        $('#v-templates-tabContent').append(`
            <div class="tab-pane fade" id="v-listTemplates-${row.name}-tab" 
            role="tabpanel" aria-labelledby="v-listTemplates-${row.name}-tab">
                <div class="d-flex flex-wrap border-end border-dark-light pe-1" id="v-listTemplates-${row.name}">
                </div>
            </div>
        `);
        $('#v-templateslist-tab').append(`
            <button class="nav-link" id="v-listTemplates-${row.name}-tab" data-bs-toggle="pill" data-bs-target="#v-listTemplates-${row.name}-tab" 
            type="button" role="tab" aria-controls="v-listTemplates-${row.name}-tab" aria-selected="false"><i class="fas fa-clone pe-2"></i> ${row.name}</button>
        `)
    }
    g_contTemplatesTabs++;
}
function name(params) {
    
}
function appendTemplatesModelstoTabs(row, view) {
    //let config = g_mapModelConfigSS.get(row.nacode)
    //let image = `https://prod.cosy.bmwusa.com/cosy/cosy?${config.configuration.walkaround360DegViewUrlPart}&angle=60&bkgnd=transparent&resp=png`;
    getTechSpecsApiV2(row.nacode).then((response) => {
        let model = response.name;
        if(view == 'list'){
            $(`#v-listTemplates-${row.name}`).append(`
                <div class="bg-dark-light border-0 shadow-sm rounded-lg p-1 me-4 mb-1 w-100" role="button" id="card-nacode-${row.nacode}">
                    <p class="mb-0">[${row.nacode}] - ${model}</p>
                </div>
            `)
        }else{
            $(`#v-listTemplates-${row.name}`).append(`
                <div class="card card-nacode border-0 shadow rounded-15 me-3 mb-3" role="button" id="card-nacode-${row.nacode}">
                    <div class="card-body text-center px-1">
                        <h4 class="card-title">${row.nacode}</h4>
                        <p class="mb-0 small">${model}</p>
                    </div>
                </div>
            `)
        }
    });
}
function onSearchTemplatesModels(){
    $('#searchOn-Template').on('keyup', function() {
        
    })
}
function appendTechValueSelect(select,row){
    $(select).append(`<option data-name="${row.name}" value="${row.key}">${row.name}.${row.key}</option>`)
}
function onSelectTechValueChange(){
    $('#keyvalueModelTech').on('change', function(event) {
        let key = $('#keyvalueModelTech').val();
        let value = g_mapTechValues.get(key);
        let mod = $('#modelchoosevalueModelTech').val();
        checkKeyFromModelsFromList(value,mod)
    })
}
function regexCheckModel(modelType){
    // x,m,electric
    switch (modelType) {
        case "x": //X Models
            return /(X[1-7])/g;
        case "m": //M Models
            return /(M[2-8])/g;
        case "electric":
            return /([1-8][1-8]e)/g;
        case "sedans":
            return /([0-9]{3}|M[0-9]{3}|[MZ][0-9]\s)(?!e)/g;
        default: //all
            return /(X[1-7])|(M[2-8])|(M?[1-8])/g;
    }
}

function checkKeyFromModelsFromList(value,mod){
    $('#buildTechspecsValuesidnohave').html('')
    $('#buildTechspecsValuesidhave').html('')
    g_modelList.forEach((model,index) => {
        if(model.name.match(regexCheckModel(mod))){
            $.ajax({
                type: "GET",
                url: 'https://qa.configure.bmwusa.com/UBYOConfigurator/v4/BM/techspecs/'+model.code,
                contentType: "application/json",
            }).then((response) => {
                printTechSpecsHas(model,response,value)
            }, (error) => {
            });
        }
    })
}
function printTechSpecsHas(model,row,value){
    let obj;
    if(value.level == 2){
        obj = read_prop(row,value.name)
        obj = read_prop(obj,value.key)
    }else{
        let a = value.name.split('.');
        obj = read_prop(row,a[0])
        obj = read_prop(obj,a[1])
        obj = read_prop(obj,value.key)
    }
    if(obj == undefined){
        $('#buildTechspecsValuesidnohave').append(`
            <p class="text-danger fw-bold mb-1">${model.code} - ${row.name}</p>
        `)
    }else{
        $('#buildTechspecsValuesidhave').append(`
            <p class="text-success fw-bold mb-1">${model.code} - ${row.name}</p>
        `)
    }
}
function read_prop(obj, prop) {
    return obj[prop];
}
document.addEventListener('DOMContentLoaded', function() {
    techEvents();
});