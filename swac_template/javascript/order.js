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
    let fd = document.getElementById("fetchedDatasets");

    switch(option) {
        case "newest":
            let newestSortedArray = fd.swac_comp.getDataSorted("updateTime");
            fd.swac_comp.removeAllData();
            //fd.swac_comp.addDataFromReference(sortedArray);
            let nfdd = newestSortedArray["fetchedData"];
            for (elem in nfdd) {
                fd.swac_comp.addSet("fetchedData", nfdd[elem]);
            }
            break;
        case "oldest":
            let oldestSortedArray = fd.swac_comp.getDataSortedReversed("updateTime");
            fd.swac_comp.removeAllData();
            //fd.swac_comp.addDataFromReference(sortedArray);
            let ofdd = oldestSortedArray["fetchedData"];
            for (elem in ofdd) {
                fd.swac_comp.addSet("fetchedData", ofdd[elem]);
            }
            break;
        case "asc":
            let sortedArray = fd.swac_comp.getDataSorted("title");
            fd.swac_comp.removeAllData();
            //fd.swac_comp.addDataFromReference(sortedArray);
            let fdd = sortedArray["fetchedData"];
            for (elem in fdd) {
                fd.swac_comp.addSet("fetchedData", fdd[elem]);
            }
            break;
        case "desc":
            let rSortedArray = fd.swac_comp.getDataSortedReversed("title");
            fd.swac_comp.removeAllData();
            //fd.swac_comp.addDataFromReference(rSortedArray);
            let rfdd = rSortedArray["fetchedData"];
            for (elem in rfdd) {
                fd.swac_comp.addSet("fetchedData", rfdd[elem]);
            }
            break;
    }
}

/**
 * Scrolls up to the top of the page
 */
function scrollUp(){
    window.scrollTo(1, 1);
}

