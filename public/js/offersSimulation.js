const cheerio = require('cheerio');
const request = require('request-promise');


function simulate_checkInputUpload(){
    $("#prioritySheetInputFile").change(function(event){
        let selectedFile = event.target.files[0];
        if(selectedFile) simulate_fileReader(selectedFile);
    });
}

function simulate_fileReader(selectedFile){
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event)=>{
        let data = event.target.result;
        let workbook = XLSX.read(data,{type:"binary"});
        console.log(workbook);
        workbook.SheetNames.forEach(sheet => {
            let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
            console.log(rowObject);
            document.getElementById("jsondata").innerHTML = JSON.stringify(rowObject,undefined,4)
        });
    }
}

async function simulate_loadpage(url){
    try {
        const $_ = await request({uri: url,transform: body => cheerio.load(body)});
        console.log($_('body').html())
        return $_('body').html();
    } catch (e) {
        console.log(e);
    }
}
function simulate_loadXLXS(){

}






document.addEventListener('DOMContentLoaded', function() {
    simulate_checkInputUpload();
});