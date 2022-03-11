const { mode } = require("crypto-js");

function techEvents(event) {
    askInputTechSpecs()
    bringKeyValuesTechSpecs()
    onSelectTechValueChange();
    onSearchTemplatesModels()
    askInputStandardFeatures();
}
function toggleOffCanvas(){
    $('#offcanvasMissingValues').toggleClass('active');
    animateCSS('#offcanvasMissingValues','fadeInRight');
    $('#offcanvasBg').toggleClass('active');
    animateCSS('#offcanvasBg','fadeIn');
    $("#canvasBGTechspecs").css('overflow-y','hidden');
}
function closeOffCavas(){
    $("#canvasBGTechspecs").css('overflow-y','auto');
    animateCSS('#offcanvasMissingValues','fadeOutRight').then(()=>{
        $('#offcanvasMissingValues').removeClass('active');
    });
    animateCSS('#offcanvasBg','fadeOut').then(()=>{
        $('#offcanvasBg').removeClass('active');
    });
}
function askInputTechSpecs() {
    $('#featuresInputList').on('change', function(event) {
        let val = $('#featuresInputList').val();
        getFeaturesApi(val);
    });
}
function askInputStandardFeatures() {
    $('#specsInputList').on('change', function(event) {
        let val = $('#specsInputList').val();
        getTechSpecsApi(val);
    });
}

var tempFeatures;
var g_features_view = "json";
function getFeaturesApi(model) {
    g_features_view = "json";
    $.ajax({
        type: "GET",
        url: `${cosy_config.ubyo}/v1/static/BM/standardfeatures/`+model,
        contentType: "application/json",
    }).then((resTech) => {
        tempFeatures = {
            tech: resTech
        };
        printStandardFeatures(resTech)
    }, (error) => {
    
    });
}

var tempTech;
var g_techspecs_view = "json";
function getTechSpecsApi(model) {
    g_techspecs_view = "json";
    $.ajax({
        type: "GET",
        url: `${cosy_config.ubyo}/v4/BM/model/`+model,
        contentType: "application/json",
    }).then((resModel) => {
        $.ajax({
            type: "GET",
            url: `${cosy_config.ubyo}/v4/BM/techspecs/`+model,
            contentType: "application/json",
        }).then((resTech) => {
            tempTech = {
                model: resModel,
                tech: resTech
            };
            printNaCodeSpecs(resTech,resModel)
            evalPropertiesTech(resTech, resModel)
        }, (error) => {
        
        });
    }, (error) => {
    
    });
}
function evalPropertiesTech(tech, model){
    let flag = true;
    $("#missingBtnTech").hide();
    $("#techSpecsfromNaCodeEmptyValues").html('')
    if(!model.isBmwi){ // not Electric
        console.log(model.series.match(/X[1-7]/g), model.series)
        if(model.bodyStyle == 'Coupe' || model.bodyStyle == 'Gran Coupe' 
        || model.bodyStyle == 'Sedan' || model.bodyStyle == 'Convertible'){ // Sedan, Coupe, Convertible - Standard
            g_tech_sedan_specs.forEach(element => {
                flag = _.has(tech, element);
                if(!flag){
                    $("#missingBtnTech").show();
                    $("#techSpecsfromNaCodeEmptyValues").append(`
                        <div class="text-danger me-2">${element}</div>
                    `)
                }
            });
        }else if(model.series.match(/X[1-7]/g)){ // SAV - Standard
            g_tech_savStandard_specs.forEach(element => {
                flag = _.has(tech, element);
                if(!flag){
                    $("#techSpecsfromNaCodeEmptyValues").append(`
                        <div class="text-danger me-2">${element}</div>
                    `)
                }
            });
        }
    }else{ // Electric

    }
}
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number-json';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key-json';
            } else {
                cls = 'string-json';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean-json';
        } else if (/null/.test(match)) {
            cls = 'null-json';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
function printNaCodeSpecs(model,code){
    $('#techSpecsfromNaCode').html(`
        <pre style="white-space: wrap; font-weight:500;" class="animate__animated animate__fadeIn">${syntaxHighlight(JSON.stringify(model, undefined, 4))}</pre>
    `)
}
function printStandardFeatures(model){
    $('#featuresfromNaCode').html(`
        <pre style="white-space: wrap; font-weight:500;" class="animate__animated animate__fadeIn">${syntaxHighlight(JSON.stringify(model, undefined, 4))}</pre>
    `)
}
const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: item,
        };
    }, initialValue);
};
function formatFeatures(){
    if(g_features_view == "naCode"){
        printStandardFeatures(tempFeatures.tech);
        g_features_view = "json";
    }else{
        g_features_view = "naCode";
        $("#featuresfromNaCode").html(template_standardFeatures(convertArrayToObject(tempFeatures.tech.standardFeaturesElements,"categoryName")));
    }
}
function formatTechSpecs(){
    if(g_techspecs_view == "naCode"){
        printNaCodeSpecs(tempTech.tech,tempTech.model);
        evalPropertiesTech(tempTech.tech, tempTech.model);
        g_techspecs_view = "json";
    }else{
        g_techspecs_view = "naCode";
        $("#techSpecsfromNaCode").html(template_SEDAN(tempTech.tech));
    }
}

function iterateOverObjectTech(obj, stack) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (typeof obj[property] == "object") {
                iterateOverObjectTech(obj[property], stack + '.' + property);
            } else {
                console.log(stack + '.' + property);
            }
        }
    }
}
async function getTechSpecsApiV2(model){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: "GET",
            url: `${cosy_config.ubyo}/v4/BM/techspecs/`+model,
            contentType: "application/json",
        }).then((response) => {
            resolve(response);
        }, (error) => {
            reject(error)
        });
    })
}
function showEngineType(models) {
    models.forEach(model => {
        if(model.name.match(/(X[1-7])/g)){
            if(model.code != '22SU'){
                if(model.code != '22ST'){
                    $.ajax({
                        type: "GET",
                        url: `${cosy_config.ubyo}/v4/BM/techspecs/`+model.code,
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


function filter22ModelsFirst(a,b){
    if(a.code.substr(0,2) == json_config.p_year){
        return 1;
    }
    return 0;
}
function loadDataListInput(list){
    $('#naCodeModelTech').html('')
    $('#naCodeModelCosysModal').html('')
    $('#naCodeModelCosysModalBefore').html('')
    buildRowModelCodesSearch(list.filter(filter22ModelsFirst))
    list.filter(filter22ModelsFirst)
    .forEach(element => {
        fillDataList(element)
    });
}
function fillDataList(model){
    $('#specsDataListNACodes').append(`<option value="${model.code}">`)
    $('#featuresDataListNACodes').append(`<option value="${model.code}">`)
    $('#naCodeModelCosysModal').append(`<option value="${model.code}">${model.code} ${model.name}</option>`)
    $('#naCodeModelCosysModalBefore').append(`<option value="${model.code}">${model.code} ${model.name}</option>`)
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
    json_config.fav_view = view;
    db.run(`UPDATE config set fav_view = ? WHERE id = 1`, 
    [json_config.fav_view], function(err) {
        if (err) {
            console.log(err.message);
        }else{
            clearTemplatesView().then((d) => {
                g_templates_techspecs.forEach((row) => {
                    appendTemplatesModelstoTabs(row,view)
                });
            });
            console.log(`%cFavorite view has been updated`,'background: #222; color: #bada55');
        }
    });
    
}

function appendTemplatesTabs(row) { // ! hacer un mostrar como card o lista en los tabpanes y poner un titulo 
    $('#v-templates-tabContent').append(`
        <div class="tab-pane fade ${g_contTemplatesTabs ? '':'active show'}" id="v-listTemplates-${row.name}-tab" 
        role="tabpanel" aria-labelledby="v-listTemplates-${row.name}-tab">
            
            <div class="d-flex flex-wrap border-end border-dark-light pe-1" id="v-listTemplates-${row.name}">
            </div>
        </div>
    `);
    $('#v-templateslist-tab').append(`
        <button class="nav-link ${g_contTemplatesTabs ? '':'active'}" id="v-listTemplates-${row.name}-tab" data-bs-toggle="pill" data-bs-target="#v-listTemplates-${row.name}-tab" 
        type="button" role="tab" aria-controls="v-listTemplates-${row.name}-tab" aria-selected="${g_contTemplatesTabs ? 'false':'true'}"><i class="fas fa-clone pe-2"></i> ${row.name}</button>
    `)
    g_contTemplatesTabs++;
}
function searchNaCodeTemplate(name) {
    let val = $(`#v-listTemplates-${name}-search`).val()
    let json = json_config;

    $(`#v-listTemplates-${name}`).html('')
    g_templates_techspecs.filter(row => (row.nacode.match(val) && row.name == name)).forEach((row) => {
        appendTemplatesModelstoTabsV2(row,json.fav_view,name)
    });
}
function appendTemplatesModelstoTabsV2(row,view,tab) {
    getTechSpecsApiV2(row.nacode).then((response) => {
        let model = response.name;
        if(view == 'list'){
            $(`#v-listTemplates-${tab}`).append(`
                <div class="bg-dark-light border-0 shadow-sm rounded-lg p-1 me-4 mb-1 w-100" role="button" id="card-nacode-${row.nacode}">
                    <p class="mb-0">[${row.nacode}] - ${model}</p>
                </div>
            `)
        }else{
            $(`#v-listTemplates-${tab}`).append(`
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
function appendTemplatesModelstoTabs(row, view) {
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
                url: `${cosy_config.ubyo}/v4/BM/techspecs/`+model.code,
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