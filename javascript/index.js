let tbl_cat_url = SWAC_config.datasources[1] + "tbl_category"
var fetchedtables = [];
let actCategory;
let actCategoryDesc;
let actCategoryName;

/**
 * Checks which boxes are checked and returns their ids
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
            checkboxesChecked.push(checkboxes[i].id);
        }
    }
    // Return the array if it is non-empty, or null
    return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}

/**
 * Checks if the category already exists
 * returns true if the category is new, otherwise it returns false
 *
 * @param catName
 * @returns {boolean} - true: category is new, false: category already exists
 */
function isNewCategory(catName){
    for (var i = 0; i < fetchedCategories.length; i++){
        if (fetchedCategories[i]["name"] == catName){
            return false;
        }
    }
    return true;
}

/**
 * Checks if the inputs are filled - if yes, the methods to send POST-requests are executed
 */
function addCategory(){
    let missingMsg = "Bitte geben Sie einen Namen, eine Beschreibung und mindestens eine Tabelle an.";
    let duplicateMsg = "Eine Kategorie mit diesem Namen ist bereits vorhanden.";
    var checkedTables = [];
    var checkedBoxes = getCheckedBoxes("checkedTables");
    var catName = document.getElementById("catname").value;
    var catDescription = document.getElementById("catdescription").value;
    if (checkedBoxes !== null && catDescription !== "" && catName !== "") {
        if (isNewCategory(catName)) {
            checkedBoxes.forEach(item => {
                checkedTables.push(item);
            })
            postCategory(catName, catDescription).then(r => postTbl_Category(catName, checkedTables));
        } else {
            alert(duplicateMsg);
        }
    } else {
        alert(missingMsg);
    }
}

/**
 * POST to insert a new category
 * @param name - category name
 * @param description - category description
 */
async function postCategory(name, description) {
    let category = {
        'name': name,
        'description': description
    }
    let formBody = [];
    for (let property in category) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(category[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    let response = await fetch(caturl+"addCategory?" + formBody, {
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        method: 'POST',
        mode: 'cors',
        dataType: 'json',
        redirect: 'follow',
        referrer: 'no-referrer',
    }).then(response => response.text()
        .then(function (text) {
                category["id"] = text;
                fetchedCategories.push(category);
                console.log(fetchedCategories);
                swacReload(fetchedCategories)
            }
        )
    )
    return await response
}

/**
 * POST to record the selected tables which belong to the created category
 * @param catName - category name
 * @param checkedTables - selected tables
 */
function postTbl_Category(catName, checkedTables) {
    let formBody = [];
    let idsEncodedKey = encodeURIComponent("table_ids");
    let idsEncodedValue = encodeURIComponent(checkedTables);
    formBody.push(idsEncodedKey + "=" + idsEncodedValue);
    let nameEncodedKey = encodeURIComponent("name");
    let nameEncodedValue = encodeURIComponent(catName);
    formBody.push(nameEncodedKey + "=" + nameEncodedValue);
    formBody = formBody.join("&");

    postDataWithout(caturl + "addTblCategory?" + formBody)
}

/**
 * If a category-edit-button (edit or delete) is pushed, actCategory is set so other functions know which category they
 * have to work with at the moment.
 * And setting the other variables as well since there is a problem with passing two or more "swac"-parameter.
 * @param id - category id
 */
function setActCategory(id){
    actCategory = id;
    for(elem in fetchedCategories){
        if(fetchedCategories[elem]["id"]==actCategory){
            actCategoryDesc = fetchedCategories[elem]["description"];
            actCategoryName = fetchedCategories[elem]["name"];
        }
    }
    console.log(actCategory);
    console.log(actCategoryDesc);
    console.log(actCategoryName);
    setModalInformation();
}

/**
 * Checks if the category-description, the user has set, is valid.
 */
function editCategory(){
    let missingMsg = "Bitte geben Sie eine Beschreibung an.";
    var catDescription = document.getElementById("categorydescription").value;
    var catName = document.getElementById("categoryname").value;
    if (catDescription !== "" && catName !== "") {
        updateCategory(catDescription, catName);
    } else {
        alert(missingMsg);
    }
}

/**
 * Since the reload method is not implemented in swac yet, this method will reload the component
 * @param arr - Array
 */
function swacReload(arr){
    let comp = document.getElementById("present_categories");
    arr.sort(function (a, b) {
        if(a.name < b.name) {return -1;}
        if(a.name > b.name) {return 1}
        return 0
    })
    comp.swac_comp.removeAllData();
    for (elem in arr) {
        comp.swac_comp.addSet("present_categories", arr[elem]);
    }
}
/**
 * Prepares the POST request to delete a category
 */
function deleteCategory(){
    let i = 0;
    let formBody = [];
    let EncodedKey = encodeURIComponent("id");
    let EncodedValue = encodeURIComponent(actCategory);
    formBody.push(EncodedKey + "=" + EncodedValue);
    formBody = formBody.join("&");
    postDataWithout(caturl + "deleteCategory?" + formBody)
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP status " + response.status);
            } else {
                for (elem in fetchedCategories) {
                    if (fetchedCategories[elem]["id"]==actCategory){
                        fetchedCategories.splice(i, 1);
                    }
                    i++;
                }
                swacReload(fetchedCategories);
            }
        })
}

/**
 * Prepares the POST request to update a category description
 * @param catDescription - new category description
 * @param catName - new categoroy name
 */
function updateCategory(catDescription, catName){
    let category = {
        'description': catDescription,
        'id': actCategory,
        'name': catName
    }

    let formBody = []
    for (let property in category) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(category[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    postDataWithout(caturl + "updateCategory?" + formBody).then(response => {

        if (!response.ok) {
            throw new Error("HTTP status " + response.status);
        } else {
            let i = 0;
            for (elem in fetchedCategories) {
                if (fetchedCategories[elem]["id"]==actCategory){
                    fetchedCategories.splice(i, 1);
                }
                i++;
            }
            fetchedCategories.push(category)
            swacReload(fetchedCategories)
        }
    });
}

const promiseOfData =
    fetch(tbl_cat_url)
        .then(r=>r.json())
        .then(data => {
            fetchedtables = data;
            return fetchedtables;
        });

window.onload = async () => {
    let promisedData = await promiseOfData;
};

function setModalInformation(){
    var catDescription = document.getElementById("categorydescription");
    catDescription.value = actCategoryDesc;
    var catName= document.getElementById("categoryname");
    catName.value = actCategoryName;
}

SWAC_reactions.addReaction(function () {
    swacReload(fetchedCategories);
}, "present_categories");