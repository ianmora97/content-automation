
function changeCosyEnter(image,type) {
    let imgPath = $(image).attr('src');
    let newHover = imgPath.split('&angle=')[0];
    switch (type) {
        case "GN20":
            $(image).attr('src', newHover + '&angle=220');
            break;
        case "LN":
            $(image).attr('src', newHover + '&angle=320');
            break;
        default:
            break;
    }
}
function changeCosyLeave(image,type) {
    let imgPath = $(image).attr('src');
    let newHover = imgPath.split('&angle=')[0];
    switch (type) {
        case "GN20":
            $(image).attr('src', newHover + '&angle=40');
            break;
        case "LN":
            $(image).attr('src', newHover + '&angle=270');
        default:
            break;
    }
}
function modalCosyTypeOnShow(){
    var cosyModal = document.getElementById('cosyModal')
    cosyModal.addEventListener('show.bs.modal', function (event) {
        /** 
        * @param ans amount of angles in a configuration
        * @param an1 angle 1 
        * @param an2 angle 2 
        */
        // TODO: create MAP with different angles
        let mapType = new Map();
        mapType.set("GN20",{ans:2,an1:40,an2:220})
        mapType.set("LN",{ans:2,an1:270,an2:320})
        mapType.set("DC24",{ans:1,an1:270})
        mapType.set("DC12",{ans:1,an1:30})
        mapType.set("DC13",{ans:1,an1:300})
        mapType.set("BM30",{ans:1,an1:60})
        mapType.set("GN17",{ans:1,an1:60})

        var button = event.relatedTarget
        var type = button.getAttribute('data-bs-type')
        $('#typeCosyModelSpan').html(type)
        let mt = mapType.get(type)
        clearIdsModalCosy()
        if(mt.ans === 2){
            $('#configAngleID').html(`
                <input type="radio" class="btn-check" name="cosy-angle" id="angle-${mt.an1}-cosy-checkbox-outlined" autocomplete="off" checked>
                <label class="btn btn-sm btn-outline-primary-cus" for="angle-${mt.an1}-cosy-checkbox-outlined" onclick="changeAngleOnPreview('${mt.an1}')">${mt.an1}</label>

                <input type="radio" class="btn-check" name="cosy-angle" id="angle-${mt.an2}-cosy-checkbox-outlined" autocomplete="off">
                <label class="btn btn-sm btn-outline-primary-cus ms-2" for="angle-${mt.an2}-cosy-checkbox-outlined" onclick="changeAngleOnPreview('${mt.an2}')">${mt.an2}</label>  
            `)
        }else if(mt.ans === 1){
            $('#configAngleID').html(`
                <input type="radio" class="btn-check" name="cosy-angle" id="angle-${mt.an1}-cosy-checkbox-outlined" autocomplete="off" checked>
                <label class="btn btn-sm btn-outline-primary-cus" for="angle-${mt.an1}-cosy-checkbox-outlined" >${mt.an1}</label>
            `)
        }else{
            $('#configAngleID').html(`
                <p>No config found</p>
            `)
        }
    })
}
function askInputCosyModalImage() {
    $('#naCodeModelCosysModal').on('change', function(event) {
        let val = $('#naCodeModelCosysModal').val();
        gerImageCosysByModel(val);
        $('#Basicconfigurationsbkangle').show()
    });
    $('#naCodeModelCosysModalBefore').on('change', function(event) {
        let val = $('#naCodeModelCosysModalBefore').val();
        getImagesCosysByModelAll(val);
    });
}
function clearIdsModalCosy(){
    $('#pathWalkaroundCosyRes').html('')
    $('#walkaroundModalCosyResponse').html('')
    $('#basicColorsCosyEnd').html('')
    $('#previewCarImageModalCosy').html('')
    $('#previewCarColorsPicker').html('')
    $('#Basicconfigurationsbkangle').hide()
}

function gerImageCosysByModel(model) {
    $.ajax({
        type: "GET",
        url: `${cosy_config.ubyo_start}`+model,
        contentType: "application/json",
    }).then((config) => {
        $.ajax({
            type: "GET",
            url: `${cosy_config.ubyo_options}`+model,
            contentType: "application/json",
        }).then((colors) => {
            let colors_filter = colors.filter(obj => {
                if(obj.code.match(/(P0(?!000))/mgs)){
                    return true;
                }
            });
            let wheelCodes = colors.filter(obj => {
                if(obj.salesGroup != undefined){
                    if(obj.salesGroup.code == 'Wheels'){
                        return true;
                    }
                }
            });
            showimagePathsCosys(config,colors_filter,wheelCodes);
        }, (error) => {
        
        });
    }, (error) => {
    
    });
}
function showCarImagePreview(path,colors=''){
    $('#previewCarImageModalCosy').html('')
    if(colors != ''){
        $('#previewCarImageModalCosy').html(`
            <img src="${path}" class="img-fluid" alt="">
        `)
        colors.forEach(c => {
            $('#previewCarColorsPicker').append(`
                <span onclick="changePaintOnPreview('${c.code}')" role="button">
                <i class="fas fa-circle me-2 p-1" style="border-radius:100%;border:#fff 1px solid;color:rgb(${c.rgbValues[0]}, ${c.rgbValues[1]}, ${c.rgbValues[2]});"></i>
                </span>
            `)
        })
    }else{
        $('#previewCarImageModalCosy').html(`
            <img src="${path}" class="img-fluid" alt="">
        `)
    }
}
function showPathImageCosyOnLoad(path,walk = '',p=''){
    if(walk != ''){
        let options = p.split('&sa=')[1].split('&')[0];
        console.log()
        $('#pathWalkaroundCosyRes').html(`
            <p class="text-light small mb-1">Path:</p>
            <p class="text-break btn-to-clip text-primary user-select-all" data-clipboard-text="${path}" id="pathCarImageSS">${path}</p>
        `)
        $('#walkaroundModalCosyResponse').append(`
            <hr>
            <p class="text-light small mb-1">Options:</p>
            <p class="text-break user-select-all btn-to-clip" data-clipboard-text="${options}">${options}</p>
            <hr>
            <p class="text-light small mb-1">Wheel Codes:</p>
        `)
        walk.forEach(element => {
            $('#walkaroundModalCosyResponse').append(`
                <span class="mb-1">${element.code} </span>
            `)
        })
    }else{
        $('#pathWalkaroundCosyRes').html(`
            <p class="text-light small mb-1">Path:</p>
            <p class="text-break btn-to-clip text-primary user-select-all" data-clipboard-text="${path}" id="pathCarImageSS">${path}</p>
        `)
    }
}

function showimagePathsCosys(response,colors,wheelCodes) {
    $('#basicColorsCosyEnd').html('');
    if($('#typeCosyModelSpan').html() == 'GN20'){
        let walkaround_path = `${cosy_config.domain}`+response.configuration.walkaround360DegViewUrlPart+'&bkgnd=1&quality=70&resp=jpeg&angle=40';
        showPathImageCosyOnLoad(walkaround_path);
        showCarImagePreview(walkaround_path);
    }else if($('#typeCosyModelSpan').html() == 'LN' || $('#typeCosyModelSpan').html() == 'DC24'){
        let walkaround_path = `${cosy_config.domain}`+response.configuration.walkaround360DegViewUrlPart+'&bkgnd=1&quality=70&resp=jpeg&angle=270';
        showPathImageCosyOnLoad(walkaround_path);
        showCarImagePreview(walkaround_path);
    }else if($('#typeCosyModelSpan').html() == "DC12"){
        let walkaround_path = `${cosy_config.domain}`+response.configuration.walkaround360DegViewUrlPart+'&bkgnd=1&quality=70&resp=jpeg&angle=30';
        showPathImageCosyOnLoad(walkaround_path,wheelCodes,response.configuration.walkaround360DegViewUrlPart);
        showCarImagePreview(walkaround_path,colors);
    }else if($('#typeCosyModelSpan').html() == "DC13"){
        let walkaround_path = `${cosy_config.domain}`+response.configuration.walkaround360DegViewUrlPart+'&bkgnd=1&quality=70&resp=jpeg&angle=300';
        showPathImageCosyOnLoad(walkaround_path);
        showCarImagePreview(walkaround_path);
    }else if($('#typeCosyModelSpan').html() == "BM30"){
        let walkaround_path = `${cosy_config.domain}`+response.configuration.walkaround360DegViewUrlPart+'&bkgnd=1&quality=70&resp=jpeg&angle=60';
        showPathImageCosyOnLoad(walkaround_path);
        showCarImagePreview(walkaround_path);
    }else if($('#typeCosyModelSpan').html() == "GN17"){
        let walkaround_path = `${cosy_config.domain}`+response.configuration.walkaround360DegViewUrlPart+'&quality=hight&bkgnd=transparent&resp=png&width=450&angle=60';
        showPathImageCosyOnLoad(walkaround_path);
        showCarImagePreview(walkaround_path);
    }
    colors.forEach(e => {
        $('#basicColorsCosyEnd').append(`
            <p class="mb-1" role="button" onclick="changePaintOnPreview('${e.code}')">${e.code} - ${e.name}</p>
        `)
    });
}

function changePaintOnPreview(paint){
    let walkaround_path = $('#pathCarImageSS').html();
    let a = walkaround_path.split('paint=');
    let b = walkaround_path.split('paint=')[1];
    let c = b.split('fabric')[1];
    let new_path = walkaround_path.split('paint=')[0]+'paint='+paint+'&fabric'+c;
    showPathImageCosyOnLoad(new_path);
    showCarImagePreview(new_path);
}

document.addEventListener('DOMContentLoaded', function() {
    modalCosyTypeOnShow();
    askInputCosyModalImage();
});

// ! ------------------------------------ all cosys paths ------------------------------------

function getImagesCosysByModelAll(model) {
    $.ajax({
        type: "GET",
        url: `${cosy_config.ubyo_start}`+model,
        contentType: "application/json",
    }).then((config) => {
        $.ajax({
            type: "GET",
            url: `${cosy_config.ubyo_options}`+model,
            contentType: "application/json",
        }).then((colors) => {
            let colors_filter = colors.filter(obj => {
                if(obj.code.match(/(P0(?!000))/mgs)){
                    return true;
                }
            });
            showimagePathsCosysAll(config,colors_filter);
        }, (error) => {
        
        });
    }, (error) => {
    
    });
}
function clearallcosysSpaces() {
    $('#configMLU').html('');
    $('#configLN').html('');
    $('#configBYO').html('');
    $('#configMSL').html('');
    $('#configAllBMWS').html('');
    $('#configGL').html('');

    $('#colorsPreviewconfigMLU').html('');
    $('#colorsPreviewconfigLN').html('');
    $('#colorsPreviewconfigBYO').html('');
    $('#colorsPreviewconfigMSL').html('');
    $('#colorsPreviewconfigAllBMWS').html('');
    $('#colorsPreviewconfigGL').html('');
}
function showimagePathsCosysAll(response,colors) {
    clearallcosysSpaces();
    let walkaround_path = "";
    // ! ----------------------- configMLU ------------------------------
    walkaround_path = `${cosy_config.domain}`+response.configuration.walkaround360DegViewUrlPart+'&quality=hight&bkgnd=transparent&w=9800&h=8000&x=180&y=800&resp=png&angle=40';
    showPathImageCosyOnLoadAll(walkaround_path,'configMLU');
    showColorsAll(colors,'configMLU');
    showImageCosyAll(walkaround_path,'configMLU');
    // ! ----------------------- configLN ------------------------------
    walkaround_path = `${cosy_config.domain}`+response.configuration.walkaround360DegViewUrlPart+'&quality=hight&bkgnd=transparent&w=9800&h=8000&x=180&y=800&resp=png&angle=270';
    showPathImageCosyOnLoadAll(walkaround_path,'configLN');
    showColorsAll(colors,'configLN');
    showImageCosyAll(walkaround_path,'configLN');
    // ! ----------------------- configMSL ------------------------------
    walkaround_path = `${cosy_config.domain}`+response.configuration.walkaround360DegViewUrlPart+'&quality=hight&bkgnd=transparent&w=9800&h=8000&x=180&y=800&resp=png&angle=270';
    showPathImageCosyOnLoadAll(walkaround_path,'configMSL');
    showColorsAll(colors,'configMSL');
    showImageCosyAll(walkaround_path,'configMSL');
    // ! ----------------------- configBYO ------------------------------
    walkaround_path = `${cosy_config.domain}`+response.configuration.walkaround360DegViewUrlPart+'&quality=hight&bkgnd=transparent&w=9800&h=8000&x=180&y=800&resp=png&angle=300';
    showPathImageCosyOnLoadAll(walkaround_path,'configBYO');
    showColorsAll(colors,'configBYO');
    showImageCosyAll(walkaround_path,'configBYO');
    // ! ----------------------- configAllBMWS ------------------------------
    walkaround_path = `${cosy_config.domain}`+response.configuration.walkaround360DegViewUrlPart+'&quality=hight&bkgnd=transparent&w=9800&h=8000&x=180&y=800&resp=png&angle=60';
    showPathImageCosyOnLoadAll(walkaround_path,'configAllBMWS');
    showColorsAll(colors,'configAllBMWS');
    showImageCosyAll(walkaround_path,'configAllBMWS');
    // ! ----------------------- configGL ------------------------------
    walkaround_path = `${cosy_config.domain}`+response.configuration.walkaround360DegViewUrlPart+'&quality=hight&bkgnd=transparent&resp=png&width=450&angle=60';
    showPathImageCosyOnLoadAll(walkaround_path,'configGL');
    showColorsAll(colors,'configGL');
    showImageCosyAll(walkaround_path,'configGL');
}

function showPathImageCosyOnLoadAll(path,id){
    $(`#${id}`).html(`
        <p class="text-light small mb-1">Path:</p>
        <p class="text-break btn-to-clip text-primary user-select-all" data-clipboard-text="${path}" id="pathCarImageSS${id}">${path}</p>
    `)
}
function showColorsAll(colors='',id){
    colors.forEach(c => {
        $(`#colorsPreview${id}`).append(`
            <span onclick="changePaintOnPreviewAll('${c.code}','${id}')" role="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${c.name}">
                <i class="fas fa-circle me-2 p-1" style="border-radius:100%;border:#fff 1px solid;color:rgb(${c.rgbValues[0]}, ${c.rgbValues[1]}, ${c.rgbValues[2]});"></i>
            </span>
        `)
    })
    enableTooltips();
}
function changePaintOnPreviewAll(paint,id){
    let walkaround_path = $(`#pathCarImageSS${id}`).html();
    let a = walkaround_path.split('paint=');
    let b = walkaround_path.split('paint=')[1];
    let c = b.split('fabric')[1];
    let new_path = walkaround_path.split('paint=')[0]+'paint='+paint+'&fabric'+c;
    showPathImageCosyOnLoadAll(new_path,id);
    showImageCosyAll(new_path,id);
}
function showImageCosyAll(path,id){
    $(`#imagePreview${id}`).html(`
        <img src="${path}" class="img-fluid" alt="">
    `)
}
// ! --------------- changes on parameters ---------------
//cosy-background
function changeBackgroundOnPreview(id){
    let path = $('#pathCarImageSS').html().replaceAll('&amp;','&');
    let a = path.split('&bkgnd=')[0];
    let b = path.split('&bkgnd=')[1].split('&quality=')[1]
    let c = `${a}&bkgnd=${id}&quality=${b}`;
    if(id == 'transparent'){
        c = c.replace('jpeg','png')
    }
    $('#pathCarImageSS').html(c);
    showCarImagePreview(c);
}

function changeAngleOnPreview(id){
    let path = $('#pathCarImageSS').html().replaceAll('&amp;','&');
    let a = path.split('&angle=')[0];
    let c = `${a}&angle=${id}`;
    $('#pathCarImageSS').html(c);
    showCarImagePreview(c);
}