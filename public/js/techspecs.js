function techEvents(event) {
    askInputTechSpecs()
    getAllModelsList();
    bringKeyValuesTechSpecs()
    onSelectTechValueChange();
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
        printNaCodeSpecs(response)
    }, (error) => {
    
    });
}
function printNaCodeSpecs(model){
    
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

function bringKeyValuesTechSpecs(){
    db.all("SELECT * FROM techspecs", [], (err, rows) => {
        if (err) {
            console.log(err);
        }else{
            rows.forEach((row) => {
                g_techValues.push(row);
                g_mapTechValues.set(row.key, row);
                appendTechValueSelect(`#keyvalueModelTech`,row)
            });
        }
    });
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