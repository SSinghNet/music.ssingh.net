const yearRedirect = () => {
        let value = $("#year").val();
        var url = new URL(window.location.href);
        let values = value.split(" ")
    
        url.searchParams.set('year', values[0]);
        url.searchParams.set('page', 0);
    
        window.location.replace(url);
};

$(document).ready(() => {
    var url = new URL(window.location.href);
    let year = url.searchParams.get("year");
    let yearSel = document.getElementById("year");

    yearSel.value = year;
    if (yearSel.value === "") {
        yearSel.value = "all-time";
    } 
});