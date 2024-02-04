$(document).ready(() => {
    var url = new URL(window.location.href);
    let type = url.searchParams.get("type");
    let typeSel = document.getElementById("sidebar-elements");

    if (type != "albums" && type != "artists" && type != "tags" && type != "lists"){
        type = "albums";
    }

    let index = 0;
    switch (type){
        case "artists":
            index = 1;
            break;
        case "tags":
            index = 2;
            break;
        case "lists":
            index = 3;
            break;
    }

    typeSel.childNodes[index].classList.add("active");
    
});