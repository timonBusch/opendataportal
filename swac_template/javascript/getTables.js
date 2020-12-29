let url = "http://localhost:8080/opendataportal-1.0-SNAPSHOT/tbl_category"
var fetchedData = [];
var fdOptions = {
    showWhenNoData: false,
    sortable: true
};

const promiseOfSomeJsonData =
    fetch(url)
    .then(r=>r.json())
    .then(data => {
        fetchedData = data
        console.log("in async");
        let tableNumber = document.getElementById("tableNumber");
        tableNumber.textContent = "Anzahl der Treffer: " + fetchedData.length;
        return fetchedData;
    });

window.onload = async () => {
    let someData = await promiseOfSomeJsonData;
    console.log("onload");
    document.getElementById('searchbar').value = "";
    SWAC_reactions.addReaction(function () {
        displayResult(getFilterFromLS());
    }, "present_categories");
};