function closeWelcome() {
    animateOnDoneClose();
    animateCSS('#welcomeHero', 'fadeOut').then(() => {
        $("#welcomeHero").remove();
    });
}

function readyLoaded(){
    animateWelcome();
}
function animateWelcome(){
    setTimeout(() => {
        $("#logo").removeClass("animate__fadeInDown");
        $("#logo").addClass("animate__infinite");
        $("#logo").addClass("animate__animated animate__pulse");
    }, 500);
}
function animateOnDoneClose(){
    $("#v-pills-tab").find("button").each(function(index, element){
        animateCSS(`#${element.id}`, 'fadeInLeft');
    });
}

document.addEventListener("DOMContentLoaded", readyLoaded);