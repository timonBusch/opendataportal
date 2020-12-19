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