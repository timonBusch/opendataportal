var exampleoptions = {
    showWhenNoData: false,
    sortable: true
};

/**
 * If a sort-option is set in outline html, the function sorts the shown datasets
 *
 * @param option - Decides the sortAfter-criteria
 */
function sortData(option){
    // filtered und searched in arrays clonen
    // alles visible stellen (oder nur swac_no=1?)
    // sortieren
    // wieder in filtered und searched
    // displayElements
    let fd = document.getElementById("fetchedDatasets");
    let sortedArray = [];
    let sortedFetchedData = [];

    // sortieren
    switch(option) {
        case "newest":
            sortedArray = fd.swac_comp.getDataSorted("updateTime");
            fd.swac_comp.removeAllData();
            sortedFetchedData = sortedArray["fetchedData"];
            for (elem in sortedFetchedData) {
                fd.swac_comp.addSet("fetchedData", sortedFetchedData[elem]);
            }
            break;
        case "oldest":
            sortedArray = fd.swac_comp.getDataSortedReversed("updateTime");
            fd.swac_comp.removeAllData();
            sortedFetchedData = sortedArray["fetchedData"];
            for (elem in sortedFetchedData) {
                fd.swac_comp.addSet("fetchedData", sortedFetchedData[elem]);
            }
            break;
        case "asc":
            sortedArray = fd.swac_comp.getDataSorted("title");
            fd.swac_comp.removeAllData();
            sortedFetchedData = sortedArray["fetchedData"];
            for (elem in sortedFetchedData) {
                fd.swac_comp.addSet("fetchedData", sortedFetchedData[elem]);
            }
            break;
        case "desc":
            sortedArray = fd.swac_comp.getDataSortedReversed("title");
            fd.swac_comp.removeAllData();
            sortedFetchedData = sortedArray["fetchedData"];
            for (elem in sortedFetchedData) {
                fd.swac_comp.addSet("fetchedData", sortedFetchedData[elem]);
            }
            break;
    }

    // alles wieder ausblenden
    searchTable();
    displayResult(getFilterFromLS());

}

/**
 * Scrolls up to the top of the page
 */
function scrollUp(){
    window.scrollTo(1, 1);
}

