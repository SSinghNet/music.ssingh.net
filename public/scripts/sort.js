const sortRedirect = () => {
    let value = $("#sort").val();
    var url = new URL(window.location.href);
    let values = value.split(" ")

    url.searchParams.set('sortBy', values[0]);
    url.searchParams.set('sortOrder', values[1])

    window.location.replace(url);
};


$(document).ready(() => {
    var url = new URL(window.location.href);
    let sortBy = url.searchParams.get("sortBy");
    let sortOrder = url.searchParams.get("sortOrder");
    let sort = document.getElementById("sort");
    let type = document.getElementById("type");

    sort.value = sortBy + " " + sortOrder;
    if (sort.value === "") {
        if (type.value === "tag") {
            sort.value = "score DESC";
        } else {
            sort.value = "releaseDate ASC";
        }
    } 
});