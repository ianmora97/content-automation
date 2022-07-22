function textCompare(){
    clearTextcompareOutputs();

    let text1 = $('#textCompareTextarea1').val();
    let text2 = $('#textCompareTextarea2').val();

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
