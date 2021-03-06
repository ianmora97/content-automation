var clipboard = new ClipboardJS('.btn-to-clip');
var _ = require('lodash');

const animateCSS = (element, animation, prefix = 'animate__', speed = 'no') =>
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);
    if(speed !== 'no'){
        node.classList.add(`${prefix}animated`, animationName, `${prefix}${speed}`);
    }else{
        node.classList.add(`${prefix}animated`, animationName);
    }
    function handleAnimationEnd(event) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        resolve('Animation ended');
    }
    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

function loaded() {
    seeTabs()
    ctrlFind()
    clipboard.on('success', function(e) {
        console.log(e);
    });
    
}
function ctrlFind(){
    window.addEventListener("keydown",function (e) {
        if (e.keyCode === 114 ||(e.metaKey && e.keyCode === 70) ||(e.ctrlKey && e.keyCode === 70)){
            console.log("Search is not in focus");
            $('#searchOn-Template').focus();
        }
    });
}

function doSuggestions(titulo){
    var suggestions = [];
    var cont = titulo.split("[")[1].split("]")[0];
    switch (g_menuTabSelected) {
        case "menu_tab_1":
            myuSuggestions()
            break;
        case "menu_tab_2":

        default:
            break;
    }
}
function myuSuggestions(){

}


function enablePopovers() {
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
    })
}
function seeTabs(params) {
    var tabEl = document.querySelector('button[data-bs-toggle="pill"]')
    tabEl.addEventListener('shown.bs.tab', function (event) {
        event.target // newly activated tab
        event.relatedTarget // previous active tab
        console.log(event.target)
    })
}


document.addEventListener('DOMContentLoaded', loaded);