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
            // Zugang zu eigener DB erforderlich
            break;
        case "oldest":
            // Zugang zu eigener DB erforderlich
            break;
        case "asc":
            let sortedArray = fd.swac_comp.getDataSorted("name");
            console.log(fd.swac_comp)
            fd.swac_comp.removeAllData();
            //fd.swac_comp.addDataFromReference(sortedArray);
            let fdd = sortedArray["fetchedData"];
            for (elem in fdd) {
                fd.swac_comp.addSet("fetchedData", fdd[elem]);
            }
            console.log(fd.swac_comp)
            break;
        case "desc":
            let rSortedArray = fd.swac_comp.getDataSortedReversed("name");
            fd.swac_comp.removeAllData();
            //fd.swac_comp.addDataFromReference(rSortedArray);
            let rfdd = rSortedArray["fetchedData"];
            for (elem in rfdd) {
                fd.swac_comp.addSet("fetchedData", rfdd[elem]);
            }
            console.log(fd.swac_comp)
            break;
    }
}

/**
 * Scrolls up to the top of the page
 */
function scrollUp(){
    window.scrollTo(1, 1);
}

