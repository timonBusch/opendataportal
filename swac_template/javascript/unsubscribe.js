function loadPopUp() {
    document.getElementById("callPopUp").click();

    var currentURL = (document.URL);
    var tableId = currentURL.split("#")[1];
    unsubscribe(tableId)
}

function unsubscribe(tbl){

}