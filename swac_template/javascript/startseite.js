let url = "http://localhost:8080/opendataportal-1.0-SNAPSHOT/tbl_category"
var fetchedtables = [];

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
 * Checks if the inputs are filled - if yes, the methods to send POST-requests are executed
 */
function addCategory(){
    let alertMsg = "Bitte geben Sie einen Namen, eine Beschreibung und mindestens eine Tabelle an."
    var checkedTables = [];
    var checkedBoxes = getCheckedBoxes("checkedTables");
    var catName = document.getElementById("catname").value;
    var catDescription = document.getElementById("catdescription").value;
    if (checkedBoxes !== null && catDescription !== "" && catName !== "") {
        checkedBoxes.forEach(item => {
            checkedTables.push(item);
        })
        postCategory(catName, catDescription);
        postTBL_Category(catName, checkedTables);
    } else {
        alert(alertMsg);
    }
}

/**
 * Posts given data to the given url
 *
 * @param url
 * @param data
 * @returns {Promise<void>}
 */
function postData(url, data) {
    return fetch(url, {
        body: data,
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        referrer: 'no-referrer',
    })
        .then(response => console.log(response));
}

/**
 * POST to insert a new category
 *
 * @param name
 * @param description
 */
function postCategory(name, description) {
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

    postData("http://localhost:8080/opendataportal-1.0-SNAPSHOT/category/addCategory", formBody);
}

/**
 * POST to record the selected tables which belong to the created category
 *
 * @param catName - category name
 * @param checkedTables - selected tables
 */
function postTBL_Category(catName, checkedTables) {
    let formBody = [];
    let idsEncodedKey = encodeURIComponent("table_ids");
    let idsEncodedValue = encodeURIComponent(checkedTables)
    formBody.push(idsEncodedKey + "=" + idsEncodedValue)
    let nameEncodedKey = encodeURIComponent("name");
    let nameEncodedValue = encodeURIComponent(catName);
    formBody.push(nameEncodedKey + "=" + nameEncodedValue);

    formBody = formBody.join("&");

    postData("http://localhost:8080/opendataportal-1.0-SNAPSHOT/category/addTBLCategory", formBody);
}

const promiseOfSomeJsonData =
    fetch(url)
        .then(r=>r.json())
        .then(data => {
            fetchedtables = data
            console.log("in async");
            return fetchedtables;
        });

window.onload = async () => {
    let someData = await promiseOfSomeJsonData;
    console.log("onload");
};