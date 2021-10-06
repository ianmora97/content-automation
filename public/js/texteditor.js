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

document.addEventListener('DOMContentLoaded', function() {
    onKeyTextArea()
});