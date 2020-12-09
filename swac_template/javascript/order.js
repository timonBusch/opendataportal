var exampleoptions = {
    showWhenNoData: false,
    sortable: true
};

function sortData(option){
    let fd = document.getElementById("fetchedDatasets");

    switch(option) {
        case 'newest':
            // Zugang zu eigener DB erforderlich
            break;
        case 'oldest':
            // Zugang zu eigener DB erforderlich
            break;
        case 'asc':
            let arr = fd.swac_comp.getDataSorted('name')
            /*
            fd.swac_comp.removeAllData();
            console.log(fd)
            let fdd = arr["fetchedData"]
            for (elem in fdd) {
                fd.swac_comp.addSet('test', fdd[elem]);
            }
            console.log(fd)*/
            break;
        case 'desc':
            fd.swac_comp.getDataSortedReversed('name')
            break;
    }


}

function scrollUp(){
    window.scrollTo(1, 1);
}

