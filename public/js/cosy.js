var g_cosy_angle = 40;
var g_cosy_angleTemp = 40;
var g_cost_typeMime = 'png'
var g_cosy_bckg = "transparent";
var g_fetch_options = new Array();
var g_cosy_wheel = "";
var g_cosy_quality = '70';
var g_cosy_color = "";
var g_cosy_upholstery = "";

var g_cosy_modelName = "";
var g_cosy_additional_params = "&width=600";
var g_cosy_additional_styles = "";

var g_cosy_path_image = "";


function clearSpaces(){
    $('#colorCosyModel').html('')
    $('#trimCosyModel').html('')
    $('#upholCosyModel').html('')
    $('#pathCosyModelContainer').html('')
    $('#colorsPreview').html('')
    $('#upholsteryPreview').html('')
    $('#trimsPreview').html('')
    $('#sizeCosyModel').html('')
    $('#widthCosyModel').html('')
    $('#heightCosyModel').html('')
}
function clearSpacesWP(){
    $('#colorCosyModel').html(`<small class="small text-muted text-center m-0">Please Choose a Model</small>`)
    $('#upholCosyModel').html(`<small class="small text-muted text-center m-0">Please Choose a Model</small>`)
    $('#trimCosyModel').html(`<small class="small text-muted text-center m-0">Please Choose a Model</small>`)
    $('#pathCosyModelContainer').html(`<small class="fw-bold small text-muted text-center m-0">Please Choose a Model</small>`)
    $('#colorsPreview').html(`<p class="small text-muted text-center mt-3">Please Choose a Model</p>`)
    $('#upholsteryPreview').html(`<p class="small text-muted text-center mt-3">Please Choose a Model</p>`)
    $('#trimsPreview').html(`<p class="small text-muted text-center mt-3">Please Choose a Model</p>`)
    $('#imagePreview').html(`<p class="small text-muted text-center mt-3">Please Choose a Model</p>`)
    $('#sizeCosyModel').html(`<small class="small text-muted text-center m-0">Please Choose a Model</small>`)
    $('#widthCosyModel').html(`<small class="small text-muted text-center m-0">Please Choose a Model</small>`)
    $('#heightCosyModel').html(`<small class="small text-muted text-center m-0">Please Choose a Model</small>`)
}

function onsearchBaronModelCodesKey(){
    $("#searchBaronModelCodes").on('keyup', function(event) {
        let search = $("#searchBaronModelCodes").val().toLowerCase();
        let list_filter = g_modelList.filter(obj => {
            if(obj.code.toLowerCase().includes(search)){
                return true;
            }else if(obj.name.toLowerCase().includes(search)){
                return true;
            }else if(obj.series.name.toLowerCase().includes(search)){
                return true;
            }
        });
        buildRowModelCodesSearch(list_filter.filter(filter22ModelsFirst));
    });
}
onsearchBaronModelCodesKey();
function buildRowModelCodesSearch(list){
    $("#modelCodesSearch").html('');
    list.forEach(elem => {
        buildModelCodesSearch(elem);
    });
}
function buildModelCodesSearch(elem){
    $("#modelCodesSearch").append(`
        <div id="modelCodeCosy-${elem.code}">
            <input type="radio" class="btn-check" name="modelCodesSearch-option" id="modelCodesSearch-option-${elem.code}" autocomplete="off" >
            <label class="btn btn-outline-primary text-center h-100" onclick="getPathFromNaCode('${elem.code}','${elem.name}','${elem.series.name}')" for="modelCodesSearch-option-${elem.code}" style="width:120px; min-height:63px;">
                <b>${elem.code}</b>
                <small class="mb-0 d-block">${elem.name}</small>
            </label>
        </div>
    `);
}
function getPathFromNaCode(nacode,name,type){
    $('#modelCodesSearch').html(`
        <div id="modelCodeCosy-${nacode}" class="position-relative">
            <button class="btn btn-primary no-shadow btn-xs position-absolute top-0 end-0" onclick="closeNACODEsearch()" style="width:20; height:20px;"> <i class="fas fa-times"></i> </button>
            <input type="radio" class="btn-check" name="modelCodesSearch-option" id="modelCodesSearch-option-${nacode}" autocomplete="off" checked>
            <label class="btn btn-outline-primary text-center h-100" for="modelCodesSearch-option-${nacode}" style="width:120px; min-height:63px !important">
                <small class="mb-0 d-block">${type}</small>
                <b>${nacode}</b>
                <small class="mb-0 d-block">${name}</small>
            </label>
        </div>
    `)
    g_cosy_name = name.replace(/\s/g, '_');
    getImagesCosysByModelAll(nacode);
}
function getImagesCosysByModelAll(model) {
    $('#imagePreview').html(`
        <div class="d-flex justify-content-center w-100">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `);
    g_cosy_modelName = model;
    $.ajax({
        type: "GET",
        url: `${cosy_config.ubyo}/v1/configuration/start/`+model,
        contentType: "application/json",
    }).then((config) => {
        let current_config = config.configuration.selectedOptions;
        $.ajax({
            type: "GET",
            url: `${cosy_config.ubyo}/v4/BM/options/`+model,
            contentType: "application/json",
        }).then((colors) => {
            g_fetch_options = colors;
            let colors_filter = colors.filter(obj => {return obj.isPaint;});
            let fabricCodes = colors.filter(obj => {return obj.isUpholstery;});
            let wheels = colors.filter(obj => {return obj.isWheel;});
            let current_trim = "";
            let ejem = _.intersectionBy(wheels, current_config, 'code');
            if(ejem.length > 0){
                current_trim = {
                    code: ejem[0].code,
                    name: ejem[0].name,
                }
            }else{
                current_trim = {
                    code: "",
                    name: "",
                }
            }
            showimagePathsCosysAll(config,colors_filter,fabricCodes,wheels,current_trim);
        }, (error) => {
        
        });
    }, (error) => {
    
    });
}
function showimagePathsCosysAll(response,colors,fabric,wheels,current_trim) {
    clearSpaces();
    let walk360 = response.configuration.walkaround360DegViewUrlPart;
    let paintName = walk360.split('&paint=')[1].split('&')[0];
    let upholName = walk360.split('&fabric=')[1].split('&')[0];

    let paint = colors.filter(obj => {return obj.code == paintName;});
    let uphol = fabric.filter(obj => {return obj.code == upholName;});

    walk360 = walk360.split('&date=')[0];
    walk360 = g_cosy_color != "" ? walk360.split('&paint=')[0] + '&paint=' + g_cosy_color + walk360.split('&paint=')[1].substr(5, walk360.length) : walk360;
    walk360 = g_cosy_upholstery  != "" ? walk360.split('&fabric=')[0] + '&fabric=' + g_cosy_upholstery  + walk360.split('&fabric=')[1].substr(5, walk360.length) : walk360;

    walkaround_path = `${cosy_config.domain}`+walk360+`&quality=${g_cosy_quality}&bkgnd=${g_cosy_bckg}&resp=${g_cost_typeMime}${g_cosy_additional_params}&angle=${g_cosy_angle}`;
    showImageCosyAll(walkaround_path);
    bringAllAnglesCache(walkaround_path);
    showPathImageCosyOnLoadAll(walkaround_path);
    showColorsAll(colors);
    showUpholstery(fabric);
    showTrims(wheels);

    g_cosy_wheel = current_trim.code;

    $('#colorCosyModel').html(`<span id="paintCodeCosy">${paint[0].code}</span> - ${paint[0].name}`);
    $('#upholCosyModel').html(`<span id="fabricCodeCosy">${uphol[0].code}</span> - ${uphol[0].name}`);
    $('#trimCosyModel').html(`<span id="trimCodeCosy">${current_trim.code}</span> - ${current_trim.name}`);
    tippy('#paintCodeCosy', {
        content: "Copied!",
        trigger: 'click',
        animation: 'shift-away-extreme',
    });
    tippy('#fabricCodeCosy', {
        content: "Copied!",
        trigger: 'click',
        animation: 'shift-away-extreme',
    });
    tippy('#trimCodeCosy', {
        content: "Copied!",
        trigger: 'click',
        animation: 'shift-away-extreme',
    });
    $("#qualityRangeLabel").html(`${g_cosy_quality}%`);
}

function statsImage(url){
    fetch(url).then(resp => resp.blob())
    .then(blob => {
        let bo = parseInt(blob.size / 1024) <= 70;
        $("#sizeCosyModel").html(`<span id="qualityIconText" class="text-${bo ? "success": "danger"}">${parseInt(blob.size / 1024)} Kb ${bo ? `<i class="fa-solid fa-circle-check text-success"></i>` : `<i class="fa-solid fa-circle-xmark text-danger"></i>`}</span>`);
        tippy('#qualityIconText', {
            content: `${bo ? "Cosy Optimized" : "Should be less than 70 Kb"}`,
            placement: 'right',
            animation: 'shift-away-extreme',
        });
    });
    var image = new Image();
    image.src = url;
    image.onload = function() {
        $("#widthCosyModel").html(`<span id="widthQualityIcon" class="text-${image.width <= 600 ? "success": "danger"}">${image.width} px ${image.width <= 600 ? `<i class="fa-solid fa-circle-check text-success"></i>` : `<i class="fa-solid fa-circle-xmark text-danger"></i>`}</span>`);
        $("#heightCosyModel").html(`${image.height} px`);
        tippy('#widthQualityIcon', {
            content: `${image.width <= 600 ? "Cosy Optimized" : "Should be less than 600px"}`,
            placement: 'right',
            animation: 'shift-away-extreme',
        });
    }
}
function showPathImageCosyOnLoadAll(path){
    $(`#pathCosyModelContainer`).html(`
        <span class="user-select-all text-break" data-clipboard-text="${path}" id="pathCosyModel">${path}</span>
    `)
    $('#pathCosyModelBtn').attr('data-clipboard-text', path);
}
function showImageCosyAll(path){
    $(`#imagePreview`).html(`
        <img src="${path}" class="img-fluid imagePreview border border-dark-light" id="imageCosyPreview_c" width="100%" style="cursor: ew-resize; ${g_cosy_additional_styles}">
    `)
    g_cosy_path_image = path;
    statsImage(path);
    DRAGIMAGECOSYFUNC();
}
function downloadImage(){
    if(g_cosy_modelName != ""){
        var a = $("<a>")
            .attr("href", g_cosy_path_image)
            .attr("download", `${g_cosy_name}.${g_cost_typeMime}`)
            .appendTo("body");
        a[0].click();
        a.remove();
    }
}

function showColorsAll(colors){
    colors.forEach(c => {
        $(`#colorsPreview`).append(`
            <span class="d-block mb-2" onclick="changePaintOnPreviewAll('${c.code}')" role="button" id="tooltip-code${c.code}">
                <i class="fas fa-circle me-2 p-1" style="border-radius:100%;border:#fff 1px solid;color:rgb(${c.rgbValues[0]}, ${c.rgbValues[1]}, ${c.rgbValues[2]});"></i> ${c.name}
            </span>
        `)
        tippy(`#tooltip-code${c.code}`, {
            content: `${c.code}`,
            placement: 'left',
            animation: 'shift-away-extreme',
        });
    })
}
function showUpholstery(fabric){
    fabric.forEach(c => {
        $(`#upholsteryPreview`).append(`
            <span class="d-block mb-2" onclick="changeUpholOnPreviewAll('${c.code}')" role="button" id="tooltip-code${c.code}">
                <img src="${cosy_config.domain}${c.cosyUrl}&bkgnd=transparent&resp=png" class="img-fluid rounded-circle me-2" style="height:30px; width:30px;"> ${c.name}
            </span>
        `)
        tippy(`#tooltip-code${c.code}`, {
            content: `${c.code}`,
            placement: 'left',
            animation: 'shift-away-extreme',
        });
    })
    enableTooltips();
}
function showTrims(trims){
    trims.forEach(c => {
        $(`#trimsPreview`).append(`
            <span class="d-block mb-2" onclick="changeTrimsOnPreviewAll('${c.code}')" role="button" id="tooltip-code${c.code}">
                <img src="${cosy_config.domain}${c.cosyUrl}&bkgnd=transparent&resp=png" class="img-fluid rounded-circle me-2" style="height:30px; width:30px;"> <span class="small">${c.name}</span>
            </span>
        `)
        tippy(`#tooltip-code${c.code}`, {
            content: `${c.code}`,
            placement: 'left',
            animation: 'shift-away-extreme',
        });
    })
    enableTooltips();
}
function bringAllAnglesCache(walkaround_path){
    $('#imagePreviewCache').html('');
    for (let i = 0; i <= 36; i++) {
        let b = walkaround_path.split('&angle=')[1];
        let new_path = walkaround_path.replace('&angle='+b, '&angle='+(i*10));
        $('#imagePreviewCache').append(`<img src="${new_path}" class="img-fluid" id="cosyImAngle-${i*10}">`)
    }
}
function closeNACODEsearch(){
    clearSpacesWP()
    buildRowModelCodesSearch(g_modelList.filter(filter22ModelsFirst));
}

var num = 36;
var swipeOptions = {
    triggerOnTouchEnd : true,
    swipeStatus: swipeStatus,
    allowPageScroll:"vertical",
    threshold:360,
}
function DRAGIMAGECOSYFUNC(){
    $("#imagePreview").swipe( swipeOptions );
}	
function swipeStatus(event, phase, direction, distance) {
    var duration = 0;
    if(direction == "left") changeImg(distance);
    else if (direction == "right") changeImg(-distance);
}
function changeImg (imgNum) {
    imgNum = Math.floor(imgNum/15); 
    if (imgNum < 1) {
    	imgNum += num;
    }
    if (imgNum > num) {
    	imgNum -= num;
    }
    let path = $('#pathCosyModel').html().replaceAll('&amp;','&');
    let angle = parseInt(path.split('&angle=')[1]);
    let new_path = path.replace('&angle='+angle, '&angle='+(imgNum*10));
    $('#pathCosyModel').html(new_path);
    $('#imageCosyPreview_c').attr('src', new_path);
    g_cosy_angle = imgNum*10;
    localStorage.setItem("angleCosy", g_cosy_angle);
}
function changeImgR (imgNum) {
    imgNum = Math.floor(imgNum/15); 
    var num2 = -Math.abs(num); 
    if (imgNum > num2) {
    	imgNum += num;
    }
    if (imgNum <= num2) {
    	imgNum += num*2;
    }
    let path = $('#pathCosyModel').html().replaceAll('&amp;','&');
    let angle = parseInt(path.split('&angle=')[1]);
    let new_path = path.replace('&angle='+angle, '&angle='+(imgNum*10));
    $('#pathCosyModel').html(new_path);
    $('#imageCosyPreview_c').attr('src', new_path);
    g_cosy_angle = imgNum*10;
    localStorage.setItem("angleCosy", g_cosy_angle);
}

// ! --------------- changes on parameters ---------------

function changeCosyType(val){
    switch (parseInt(val)) {
        case 0:
            g_cosy_additional_params = "&width=600";
            g_cosy_angle = 40;
            g_cosy_quality = "70";
            break;
        case 1: // model lineup
            g_cosy_additional_params = "&width=600&w=9800&h=8000&x=100&y=800";
            g_cosy_angle = 40;
            g_cosy_quality = "70";
            break;
        case 2: // localnav
            g_cosy_additional_params = "&width=560&w=9800&h=8000&x=100&y=600";
            g_cosy_angle = 270;
            g_cosy_quality = "70";
            break;
        case 3:
            g_cosy_additional_params = "&width=600&width=450";
            g_cosy_angle = 60;
            g_cosy_quality = "70";
            break;
        case 4:
            g_cosy_additional_params = "";
            g_cosy_angle = 60;
            g_cosy_quality = "70";
            break;
        case 5:
            g_cosy_additional_params = "&x=-350";
            g_cosy_angle = 40;
            g_cosy_quality = "100";
            break;
        case 6:
            g_cosy_additional_params = "";
            g_cosy_angle = 300;
            g_cosy_quality = "100";
            break;
        default:
            g_cosy_additional_params = "";
            g_cosy_angle = 40;
            break;
    }
    $("#rangeQuality").val(g_cosy_quality)
    $("#qualityRangeLabel").html(`${g_cosy_quality}%`);
    if(g_cosy_modelName != ""){
        localStorage.setItem("angleCosy", g_cosy_angle);
        getImagesCosysByModelAll(g_cosy_modelName)
    }
}
function changeAngleModelCosy(direction){ // ! not using
    if((g_cosy_angle >= 0 && direction == 'right' && g_cosy_angle < 360) || (g_cosy_angle <= 360 && direction == 'left' && g_cosy_angle > 0)){
        g_cosy_angle = g_cosy_angle + (direction == 'left' ? -10 : 10);
        localStorage.setItem("angleCosy", g_cosy_angle);
        $('#angleNameCosyNumber').html(g_cosy_angle);

        let walkaround_path = $('#pathCosyModel').html().replaceAll('&amp;','&');
        let b = walkaround_path.split('&angle=')[1];
        let new_path = walkaround_path.replace('&angle='+b, '&angle='+g_cosy_angle);

        showPathImageCosyOnLoadAll(new_path);
        showImageCosyAll(new_path);
    }
}

function changePaintOnPreviewAll(paint){
    let walkaround_path = $('#pathCosyModel').html().replaceAll('&amp;','&');
    let b = walkaround_path.split('&paint=')[1].split('&')[0];
    let new_path = walkaround_path.replace(b,paint);
    g_cosy_color = paint;
    showPathImageCosyOnLoadAll(new_path);
    showImageCosyAll(new_path);
    bringAllAnglesCache(new_path);
    let paintf = _.find(g_fetch_options, ['code', paint]);
    $('#colorCosyModel').html(`<span id="paintCodeCosy">${paintf.code}</span> - ${paintf.name}`);
    tippy('#paintCodeCosy', {
        content: "Copied!",
        trigger: 'click',
        animation: 'shift-away-extreme',
    });
}
function changeUpholOnPreviewAll(fabric){
    let walkaround_path = $('#pathCosyModel').html().replaceAll('&amp;','&');
    let b = walkaround_path.split('&fabric=')[1].split('&')[0];
    let new_path = walkaround_path.replace(b,fabric);
    g_cosy_upholstery = fabric;
    showPathImageCosyOnLoadAll(new_path);
    showImageCosyAll(new_path);
    bringAllAnglesCache(new_path);
    let frabicf = _.find(g_fetch_options, ['code', fabric]);
    $('#upholCosyModel').html(`<span id="fabricCodeCosy">${frabicf.code}</span> - ${frabicf.name}`);
    tippy('#fabricCodeCosy', {
        content: "Copied!",
        trigger: 'click',
        animation: 'shift-away-extreme',
    });
}
function changeTrimsOnPreviewAll(wheel){
    let walkaround_path = $('#pathCosyModel').html().replaceAll('&amp;','&');
    let new_path = walkaround_path.replace(g_cosy_wheel, wheel);
    showPathImageCosyOnLoadAll(new_path);
    showImageCosyAll(new_path);
    bringAllAnglesCache(new_path);
    g_cosy_wheel = wheel;
    let wheelf = _.find(g_fetch_options, ['code', wheel]);
    $('#trimCosyModel').html(`<span id="trimCodeCosy">${wheelf.code}</span> - ${wheelf.name}`);
    tippy('#trimCodeCosy', {
        content: "Copied!",
        trigger: 'click',
        animation: 'shift-away-extreme',
    });
}
function changeQualityImage(){
    let quali = $("#rangeQuality").val();
    $("#qualityRangeLabel").html(`${quali}%`);
    g_cosy_quality = quali;
    let _path = $('#pathCosyModel').html();
    console.log(_path);
    if(g_cosy_modelName != ""){
        let walkaround_path = _path.replaceAll('&amp;','&');
        let b = walkaround_path.split('&quality=')[1].split('&')[0];
        let new_path = walkaround_path.replace("&quality="+b, "&quality="+quali);
        showPathImageCosyOnLoadAll(new_path);
        showImageCosyAll(new_path);
        bringAllAnglesCache(new_path);
    }
}
function changeBackgroundOnPreview(id){
    let path = $('#pathCosyModel').html().replaceAll('&amp;','&');
    let a = path.split('&bkgnd=')[0];
    let b = path.split('&bkgnd=')[1].split('&resp=')[1]
    let new_path = `${a}&bkgnd=${id}&resp=${b}`;

    g_cosy_bckg = id;
    if(id == 'transparent'){
        g_cost_typeMime = "png";
        new_path = new_path.replace('jpeg','png')
    }else{
        g_cost_typeMime = "jpeg";
        new_path = new_path.replace('png','jpeg')
    }
    showPathImageCosyOnLoadAll(new_path);
    showImageCosyAll(new_path);
    bringAllAnglesCache(new_path);
}
function tabChangeCosy(){
    var tabs = document.querySelectorAll("#pills-tab-Cosy li button")
    tabs.forEach(function(tab){
        tab.addEventListener('shown.bs.tab', function (event) {
            let newT = event.target // newly activated tab
            let oldT = event.relatedTarget // previous active tab
            if(newT.id.split('-')[1] == "trims"){
                g_cosy_angle = 90;
                g_cosy_additional_styles = "transform: scale(2.5) translateX(140px) translateY(-30px);"
            }else{
                g_cosy_angle = parseInt(localStorage.getItem('angleCosy'));
                g_cosy_additional_styles = ""
            }
            if(g_cosy_modelName != ""){
                let path = $('#pathCosyModel').html().replaceAll('&amp;','&');
                let angle = parseInt(path.split('&angle=')[1]);
                let new_path = path.replace('&angle='+angle, '&angle='+(g_cosy_angle));
                showPathImageCosyOnLoadAll(new_path);
                showImageCosyAll(new_path);
            }
        })
    });
}
tabChangeCosy();
document.addEventListener('DOMContentLoaded', function() {
    
});