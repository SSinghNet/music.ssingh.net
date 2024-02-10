$(document).ready(() => {
    let names = document.getElementsByClassName("album-name");
    
    for (let i = 0; i < names.length; i++){
        if (names[i].textContent.length > 45) {
            names[i].textContent = names[i].textContent.substring(0, 42) + "...";
        }
    }    

    names = document.getElementsByClassName("badge-album-name");
    
    for (let i = 0; i < names.length; i++){
        if (names[i].textContent.length > 35) {
            names[i].textContent = names[i].textContent.substring(0, 32) + "...";
        }
    }    
});