let tbl_cat_url = SWAC_config.datasources[1] + "tbl_category"
var fetchedData = [];

const promiseOfData =
    fetch(tbl_cat_url)
    .then(r=>r.json())
    .then(data => {
        fetchedData = data
        console.log("in async");
        let tableNumber = document.getElementById("tableNumber");
        tableNumber.textContent = "Anzahl der Treffer: " + fetchedData.length;
        return fetchedData;
    });

const filterWhenReady = function (requestors) {
    let present_categories_req = requestors['present_categories'];
    let fetchedDatasets_req = requestors['fetchedDatasets'];
    displayResult(getFilterFromLS());
};

window.onload = async () => {
    let promiesdData = await promiseOfData;
    console.log("onload");
    document.getElementById('searchbar').value = "";
    SWAC_reactions.addReaction(filterWhenReady, "present_categories", "fetchedDatasets");
};

