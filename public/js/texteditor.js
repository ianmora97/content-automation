require('colors');
const Diff = require('diff');

function onKeyTextArea() {
    $('#urlsTextarea').on('keyup', function (event) {
        if(event.keyCode == 13){
            $('#buildOutput').html('');
            var text = $(this).val();
            var urls = text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            if (urls != null) {
                var urls_unique = urls.filter(function (elem, index, self) {
                    return index == self.indexOf(elem);
                });
                $('#urlsTextarea').val(urls_unique.join('\n'));
                buildURLs(urls_unique)
            }
        }
    })
}
function formatLinks(){
    $('#buildOutput').html('');
    var text = $("#urlsTextarea").val();
    var urls = text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (urls != null) {
        var urls_unique = urls.filter(function (elem, index, self) {
            return index == self.indexOf(elem);
        });
        $('#urlsTextarea').val(urls_unique.join('\n'));
        buildURLs(urls_unique)
    }
}
function buildURLs(urls) {
    let urls1 = new Array();
    let urls2 = new Array();
    urls.forEach(function (url) {
        if(url.includes('www.staging')) {
            urls1.push(`${url.replace('staging', 'prod')}<br>`);
            urls2.push(`${url.replace('.staging', '').replace('bmwusacm', 'bmwusa').replace('.co', '.com')}<br>`)
        }else if(url.includes('www.prod')){
            urls1.push(`${url.replace('prod', 'staging')}<br>`);
            urls2.push(`${url.replace('.prod', '').replace('bmwusacm', 'bmwusa').replace('.co', '.com')}<br>`)
        }else if(url.includes('www.bmwusa.com')){
            urls1.push(`${url.replace('www.', 'www.staging.').replace('bmwusa', 'bmwusacm').replace('.com', '.co')}<br>`);
            urls2.push(`${url.replace('www.', 'www.prod.').replace('bmwusa', 'bmwusacm').replace('.com', '.co')}<br>`);
        }
    });
    urls1.forEach(url =>{
        $('#buildOutput').append(url);
    })
    $('#buildOutput').append('<br>')
    urls2.forEach(url =>{
        $('#buildOutput').append(url);
    })
}
function clearTextareaUrls() {
    $('#buildOutput').html('');
    $('#urlsTextarea').val('');
}
function clearTextcompareOutputs(){
    $('#outputTextarea1').html('');
    $('#outputTextarea2').html('');

}
function textCompare(){
    clearTextcompareOutputs();

    let text1 = $('#textCompareTextarea1').val();
    let text2 = $('#textCompareTextarea2').val();
    $("#bottomTextCompare").show();

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
function clearTextareaTextCompare() {
    $("#bottomTextCompare").hide();
    $('#outputTextarea1').html('');
    $('#outputTextarea2').html('');
    $('#textCompareTextarea1').val('');
    $('#textCompareTextarea2').val('');
}

document.addEventListener('DOMContentLoaded', function() {
    onKeyTextArea()
});