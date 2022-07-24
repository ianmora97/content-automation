
function eventlisteners(){
    let buttonCompareText = $('#buttonCompareText');
    buttonCompareText.on('click', textCompare);
}

function clearTextcompareOutputs(){
    $('#outputTextarea1').html('');
    $('#outputTextarea2').html('');

}
function clearTextareaTextCompare() {
    $('#outputTextarea1').html('');
    $('#outputTextarea2').html('');
    $('#textCompareTextarea1').val('');
    $('#textCompareTextarea2').val('');
}

function textCompare(){
    clearTextcompareOutputs();
    
    $('#outputTextarea1').html(`<div class="text-center lds-dual-ring"></div>`);
    $('#outputTextarea2').html(`<div class="text-center lds-dual-ring"></div>`);

    let url1 = $('#textCompareTextarea1').val();
    let url2 = $('#textCompareTextarea2').val();

    if(url1 === '' || url2 === ''){
        alert('Please enter two URLs');
        clearTextcompareOutputs();
        return;
    }
    if(!areLinks(url1,url2)){
        alert('Please enter two valid URLs');
        clearTextcompareOutputs();
        return;
    }
    let iframeCheck = $('#iframeCheck').is(':checked');
    switch(iframeCheck){
        case true:
            renderIframe(url1,url2);
            break;
        case false:
            renderText(url1,url2);
            break;
    }
}
async function renderText(url1,url2){
    let text1 = await requestEnvs(url1);
    let text2 = await requestEnvs(url2);

    if(_.isEqual(text1, text2)){
        $('#outputTextarea1').html('<p class="text-success">Texts are equal</p>');
        $('#outputTextarea2').html('<p class="text-success">Texts are equal</p>');
    }else{
        const diff = Diff.diffWords(text1, text2);
        let diffs = new Array();
        fragment = document.createDocumentFragment();
        diff.forEach(function (part) {
            if(part.added){
                diffs.push(`<span class="text-success">${part.value}</span>`);
            }else if(part.removed){
                diffs.push(`<span class="text-danger">${part.value}</span>`);
            }else{
                diffs.push(part.value);
            }
        });
        $('#outputTextarea1').html(text1);
        $('#outputTextarea2').html(diffs.join(''));
    }
}
function renderIframe(url1,url2){
    $('#outputTextarea1').html(`
        <div class="bg-white">
            <iframe src="${url1}" style="width:100%;height:80vh;border:none;"></iframe>
        </div>
    `);
    $('#outputTextarea2').html(`
        <div class="bg-white">
            <iframe src="${url2}" style="width:100%;height:80vh;border:none;"></iframe>
        </div>
    `);
}
function removeHeader(text){
    let regex = /<script[^>]*>.*<\/script>/g;
    let result = result.replace(regex, '');
    regex = /<style[^>]*>.*<\/style>/g;
    result = result.replace(regex, '');
    regex = /<link[^>]*>/g;
    result = result.replace(regex, '');
    return result;
}
function requestEnvs(url){
    return new Promise(function(resolve, reject){
        $.ajax({
            type: "GET",
            url: url,
            contentType: "appication/json"
        }).then((response) => {
            resolve(response);
        }, (error) => {
            reject(error);
        });
    });
}
function areLinks(url1,url2){
    let regex = /^(http|https):\/\/[^ "]+$/;
    return regex.test(url1) && regex.test(url2);
}

document.addEventListener('DOMContentLoaded', eventlisteners);