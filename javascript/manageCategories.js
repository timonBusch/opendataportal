let caturl = SWAC_config.datasources[1] + "category/"
var fetchedCategories = [];
let checkedCategories = [];
let tbl_id;

/**
 * Fetches categories from server
 */
function getCategories(){
    console.log("to_server");
    fetch(caturl)
        .then(r=>r.json())
        .then(data => {
            fetchedCategories = data.sort(function (a, b) {
                if(a.name < b.name) {return -1;}
                if(a.name > b.name) {return 1}
                return 0
            });
            return data;
        });
}
getCategories();

/**
 * In outline.html: if a category should be edited, this function is executed to save the categoriesthat belongs to
 * the given table to the array checkedCategories
 * @param id - table ID
 */
function setChecks(id){
    let cats = document.getElementById(id).getElementsByClassName("cat")[0].textContent;
    let i;
    tbl_id = id;
    checkedCategories = [];
    for (i = 0; i < fetchedCategories.length; i++) {
        if (cats.includes(fetchedCategories[i]["name"])) {
            let checkBox = document.getElementById("cat_"+fetchedCategories[i]["id"]);
            checkBox.checked = true;
            checkedCategories.push(fetchedCategories[i]["id"].toString())
        } else {
            let checkBox = document.getElementById("cat_"+fetchedCategories[i]["id"]);
            checkBox.checked = false;
        }
    }
}

/**
 * Checks which boxes are checked and returns their ID
 * @param chkboxName
 * @returns {[]|null}
 */
function getCheckedBoxes(chkboxName) {
    var checkboxes = document.getElementsByName(chkboxName);
    var checkboxesChecked = [];
    // loop over them all
    for (var i=1; i<checkboxes.length; i++) {
        // And stick the checked ones onto an array...
        if (checkboxes[i].checked) {
            checkboxesChecked.push(checkboxes[i].id.substring(4, checkboxes[i].id.length));
        }
    }
    // Return the array if it is non-empty, or null
    return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}

/**
 * Gets the categories, that are selected by the user in "addToCategory_modal" (outline.html)
 */
function editCategories(){
    var finCategories = getCheckedBoxes("checkedCategories");
    assignCategories(checkedCategories, finCategories);
}

/**
 * Checks if an element is part of another array
 * @param source - array
 * @param target - element
 * @returns {boolean} true: target is element of source, false: target is not element of source
 */
function containsAny(source, target){
    var result = source.filter(function(item){ return target.indexOf(item) > -1});
    return (result.length > 0);
}

/**
 * All the categories in startCategories should be deleted.
 * All the categories in finCategories should be inserted -> toInsert.
 * If a category is part of both arrays, nothing should be done with it.
 * @param startCategories - the categories, that have belonged to the table before the user selection
 * @param finCategories - the categories, that the user has selected to be the categories of the table
 */
function assignCategories(startCategories, finCategories){
    let toDelete = [];
    let i = startCategories.length;
    while(i--) toDelete[i] = startCategories[i];
    let toInsert = [];
    if (finCategories == null) {
        deleteCategories(toDelete);
    } else {
        for (i = 0; i < finCategories.length; i++) {
            if (containsAny(toDelete, finCategories[i])) {
                let index = toDelete.indexOf(finCategories[i]);
                if (index > -1) {
                    toDelete.splice(index, 1);
                }
                index = finCategories.indexOf(finCategories[i]);
                if (index > -1 && containsAny(startCategories, finCategories[i]) === false) {
                    toInsert.push(finCategories[i]);
                }
            } else {
                if (containsAny(startCategories, finCategories[i]) === false) {
                    toInsert.push(finCategories[i]);
                }
            }
        }
        if (toDelete.length > 0) {
            deleteCategories(toDelete);
        }
        if (toInsert.length > 0){
            insertCategories(toInsert);
        }

    }
    updateFetchedCategories(finCategories);
    updateOverview();
}

/**
 * Updating the "local" categories
 *
 * @param finCategories - All categories that belongs to a table
 */
function updateFetchedCategories(finCategories){
    let categorystring = "";
    for (let elem in fetchedCategories){
        if (finCategories != null) {
            if (containsAny(finCategories, fetchedCategories[elem]["id"].toString())) {
                if (categorystring == "") {
                    categorystring += fetchedCategories[elem]["name"]
                } else {
                    categorystring += ", " + fetchedCategories[elem]["name"];
                }
            }
        }
    }
    for (let elem in fetchedData){
        if (fetchedData[elem]["tbl_id"] == tbl_id){
            fetchedData[elem]["categories"] =  categorystring;
        }
    }
}

/**
 * If categories of a table have changed, the overview has to be updated...
 * There may be new categories to display or filters that will proceed.
 *
 */
function updateOverview(){
    let comp = document.getElementById("fetchedDatasets");
    comp.swac_comp.removeAllData();
    for (elem in fetchedData) {
        comp.swac_comp.addSet("fetchedData", fetchedData[elem]);
    }
    searchTable();
    displayResult(getFilterFromLS());
}

/**
 * Prepares the POST request to insert the selected categories into the "relation"-table (between table and category)
 * @param finCategories - array with the categories to insert
 */
function insertCategories(finCategories){
    let formBody = [];
    let tblidEncodedKey = encodeURIComponent("table_id");
    let tblidEncodedValue = encodeURIComponent(tbl_id);
    formBody.push(tblidEncodedKey + "=" + tblidEncodedValue);
    let catidsEncodedKey = encodeURIComponent("category_ids");
    let catidsEncodedValue = encodeURIComponent(finCategories);
    formBody.push(catidsEncodedKey + "=" + catidsEncodedValue);
    formBody = formBody.join("&");

    postDataWithout(caturl + "addTblCategories?" + formBody);
}

/**
 * Prepares the POST request to delete the selected categories from the "relation"-table (between table and category)
 * @param startCategories - array with the categories to delete
 */
function deleteCategories(startCategories){
    let formBody = [];
    let tblidEncodedKey = encodeURIComponent("table_id");
    let tblidEncodedValue = encodeURIComponent(tbl_id);
    formBody.push(tblidEncodedKey + "=" + tblidEncodedValue);
    let catidsEncodedKey = encodeURIComponent("category_ids");
    let catidsEncodedValue = encodeURIComponent(startCategories);
    formBody.push(catidsEncodedKey + "=" + catidsEncodedValue);
    formBody = formBody.join("&");

    postDataWithout(caturl + "deleteTblCategories?" + formBody);
}
