var clipboard = new ClipboardJS('.btn-to-clip');

function loaded() {
    seeTabs()

    clipboard.on('success', function(e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
    
        e.clearSelection();
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
function enableTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
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