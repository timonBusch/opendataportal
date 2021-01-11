/**
 * If a sort-option is set in outline html, the function sorts the shown datasets
 * @param option - Decides the sortAfter-criteria
 */
function sortData(option){
    let fd = document.getElementById("fetchedDatasets");
    let sortedArray = [];
    let sortedFetchedData = [];

    switch(option) {
        case "newest":
            sortedArray = fd.swac_comp.getDataSorted("updateTime");
            break;
        case "oldest":
            sortedArray = fd.swac_comp.getDataSortedReversed("updateTime");
            break;
        case "asc":
            sortedArray = fd.swac_comp.getDataSorted("title");
            break;
        case "desc":
            sortedArray = fd.swac_comp.getDataSortedReversed("title");
            break;
    }

    fd.swac_comp.removeAllData();
    sortedFetchedData = sortedArray["fetchedData"];
    for (elem in sortedFetchedData) {
        fd.swac_comp.addSet("fetchedData", sortedFetchedData[elem]);
    }
    searchTable();
    displayResult(getFilterFromLS());
}

/**
 * Scrolls up to the top of the page
 */
function scrollUp(){
    window.scrollTo(1, 1);
}

