let caturl = "http://localhost:8080/opendataportal-1.0-SNAPSHOT/category"
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
            fetchedCategories = data;
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
 * @returns {boolean}
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
    let toInsert = [];
    let i;
    if (finCategories == null) {
        deleteCategories(startCategories);
    } else {
        for (i = 0; i < finCategories.length; i++) {
            if (containsAny(startCategories, finCategories[i])) {
                let index = startCategories.indexOf(finCategories[i]);
                if (index > -1) {
                    startCategories.splice(index, 1);
                }
                index = finCategories.indexOf(finCategories[i]);
                if (index > -1) {
                    toInsert.push(finCategories[i]);
                }
            } else {
                toInsert.push(finCategories[i]);
            }
        }
        deleteCategories(startCategories);
        insertCategories(toInsert);
    }
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

    postData(caturl+"/addTBLCategories", formBody);
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

    postData(caturl+"/deleteTBLCategories", formBody);
}
