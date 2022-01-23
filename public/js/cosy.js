
// All copyrights to PimpTrizkit/PJs
const pSBC=(p,c0,c1,l)=>{
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!this.pSBCr)this.pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}
// ! ------------------------------------ New ------------------------------------
var g_cosy_angle = 40;
var g_cost_typeMime = 'png'
var g_cosy_bckg = "transparent";
var g_fetch_options = new Array();
var g_cosy_wheel = "";

function clearSpaces(){
    $('#colorCosyModel').html('')
    $('#trimCosyModel').html('')
    $('#upholCosyModel').html('')
    $('#pathCosyModelContainer').html('')
    $('#colorsPreview').html('')
    $('#upholsteryPreview').html('')
    $('#trimsPreview').html('')
}

function onsearchBaronModelCodesKey(){
    $("#searchBaronModelCodes").on('keyup', function(event) {
        let search = $("#searchBaronModelCodes").val().toLowerCase();
        let list_filter = g_modelList.filter(obj => {
            if(obj.code.toLowerCase().includes(search)){
                return true;
            }else if(obj.name.toLowerCase().includes(search)){
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
            <label class="btn btn-outline-primary text-center h-100" onclick="getPathFromNaCode('${elem.code}','${elem.name}')" for="modelCodesSearch-option-${elem.code}" style="width:120px; height:63px;">
                <b>${elem.code}</b>
                <small class="mb-0 d-block">${elem.name}</small>
            </label>
        </div>
    `);
}
function getPathFromNaCode(nacode,name){
    $('#modelCodesSearch').html(`
        <div id="modelCodeCosy-${nacode}">
            <input type="radio" class="btn-check" name="modelCodesSearch-option" id="modelCodesSearch-option-${nacode}" autocomplete="off" checked>
            <label class="btn btn-outline-primary text-center h-100" for="modelCodesSearch-option-${nacode}" style="width:120px; height:63px !important">
                <b>${nacode}</b>
                <small class="mb-0 d-block">${name}</small>
            </label>
        </div>
    `)
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
    $.ajax({
        type: "GET",
        url: `${cosy_config.ubyo_start}`+model,
        contentType: "application/json",
    }).then((config) => {
        let current_config = config.configuration.selectedOptions;
        $.ajax({
            type: "GET",
            url: `${cosy_config.ubyo_options}`+model,
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
    
    walkaround_path = `${cosy_config.domain}`+walk360+`&quality=high&bkgnd=${g_cosy_bckg}&resp=${g_cost_typeMime}&angle=${g_cosy_angle}`;
    bringAllAnglesCache(walkaround_path);
    showPathImageCosyOnLoadAll(walkaround_path);
    showColorsAll(colors);
    showUpholstery(fabric);
    showTrims(wheels);
    showImageCosyAll(walkaround_path);

    g_cosy_wheel = current_trim.code;

    $('#colorCosyModel').html(`${paint[0].code} - ${paint[0].name}`);
    $('#upholCosyModel').html(`${uphol[0].code} - ${uphol[0].name}`);
    $('#trimCosyModel').html(`${current_trim.code} - ${current_trim.name}`);
}
function showPathImageCosyOnLoadAll(path){
    $(`#pathCosyModelContainer`).html(`
        <span class="user-select-all text-break" data-clipboard-text="${path}" id="pathCosyModel">${path}</span>
    `)
    $('#pathCosyModelBtn').attr('data-clipboard-text', path);
}
function showColorsAll(colors){
    colors.forEach(c => {
        $(`#colorsPreview`).append(`
            <span class="d-block mb-2" onclick="changePaintOnPreviewAll('${c.code}')" role="button" title="${c.code}">
                <i class="fas fa-circle me-2 p-1" style="border-radius:100%;border:#fff 1px solid;color:rgb(${c.rgbValues[0]}, ${c.rgbValues[1]}, ${c.rgbValues[2]});"></i> ${c.name}
            </span>
        `)
    })
    enableTooltips();
}
function showUpholstery(fabric){
    fabric.forEach(c => {
        $(`#upholsteryPreview`).append(`
            <span class="d-block mb-2" onclick="changeUpholOnPreviewAll('${c.code}')" role="button" title="${c.code}">
                <img src="${cosy_config.domain}${c.cosyUrl}&bkgnd=transparent&resp=png" class="img-fluid rounded-circle me-2" style="height:30px; width:30px;"> ${c.name}
            </span>
        `)
    })
    enableTooltips();
}
function showTrims(trims){
    trims.forEach(c => {
        $(`#trimsPreview`).append(`
            <span class="d-block mb-2" onclick="changeTrimsOnPreviewAll('${c.code}')" role="button" title="${c.code}">
                <img src="${cosy_config.domain}${c.cosyUrl}&bkgnd=transparent&resp=png" class="img-fluid rounded-circle me-2" style="height:30px; width:30px;"> <span class="small">${c.name}</span>
            </span>
        `)
    })
    enableTooltips();
}
function showImageCosyAll(path){
    $(`#imagePreview`).html(`
        <img src="${path}" class="img-fluid" id="imageCosyPreview_c" width="100%" style="cursor: ew-resize;">
    `)
    DRAGIMAGECOSYFUNC();
}
function bringAllAnglesCache(walkaround_path){
    $('#imagePreviewCache').html('');
    for (let i = 0; i <= 36; i++) {
        let b = walkaround_path.split('&angle=')[1];
        let new_path = walkaround_path.replace('&angle='+b, '&angle='+(i*10));
        $('#imagePreviewCache').append(`<img src="${new_path}" class="img-fluid" id="cosyImAngle-${i*10}">`)
    }
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
    console.log(imgNum);
    let path = $('#pathCosyModel').html().replaceAll('&amp;','&');
    let angle = parseInt(path.split('&angle=')[1]);
    let new_path = path.replace('&angle='+angle, '&angle='+(imgNum*10));
    $('#pathCosyModel').html(new_path);
    $('#imageCosyPreview_c').attr('src', new_path);
    g_cosy_angle = imgNum*10;
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
    console.log(imgNum);
    let path = $('#pathCosyModel').html().replaceAll('&amp;','&');
    let angle = parseInt(path.split('&angle=')[1]);
    let new_path = path.replace('&angle='+angle, '&angle='+(imgNum*10));
    $('#pathCosyModel').html(new_path);
    $('#imageCosyPreview_c').attr('src', new_path);
    g_cosy_angle = imgNum*10;
}

// ! --------------- changes on parameters ---------------

/**
 * left or right, sum *10 to the current angle
 * @param {String} direction 
 */
function changeAngleModelCosy(direction){
    if((g_cosy_angle >= 0 && direction == 'right' && g_cosy_angle < 360) || (g_cosy_angle <= 360 && direction == 'left' && g_cosy_angle > 0)){
        g_cosy_angle = g_cosy_angle + (direction == 'left' ? -10 : 10);
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
    showPathImageCosyOnLoadAll(new_path);
    showImageCosyAll(new_path);
    bringAllAnglesCache(new_path);
    let paintf = _.find(g_fetch_options, ['code', paint]);
    $('#colorCosyModel').html(`${paintf.code} - ${paintf.name}`);
}
function changeUpholOnPreviewAll(fabric){
    let walkaround_path = $('#pathCosyModel').html().replaceAll('&amp;','&');
    let b = walkaround_path.split('&fabric=')[1].split('&')[0];
    let new_path = walkaround_path.replace(b,fabric);
    showPathImageCosyOnLoadAll(new_path);
    showImageCosyAll(new_path);
    bringAllAnglesCache(new_path);
    let frabicf = _.find(g_fetch_options, ['code', fabric]);
    $('#upholCosyModel').html(`${frabicf.code} - ${frabicf.name}`);
}
function changeTrimsOnPreviewAll(wheel){
    let walkaround_path = $('#pathCosyModel').html().replaceAll('&amp;','&');
    let new_path = walkaround_path.replace(g_cosy_wheel, wheel);
    showPathImageCosyOnLoadAll(new_path);
    showImageCosyAll(new_path);
    bringAllAnglesCache(new_path);
    g_cosy_wheel = wheel;
    let wheelf = _.find(g_fetch_options, ['code', wheel]);
    $('#trimCosyModel').html(`${wheelf.code} - ${wheelf.name}`);
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

document.addEventListener('DOMContentLoaded', function() {
    
});