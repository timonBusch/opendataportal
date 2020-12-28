let caturl = "http://localhost:8080/opendataportal-1.0-SNAPSHOT/category"
var fetchedCategories = [];

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
let checkedCategories = [];
let tbl_id;

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

function editCategories(){
    var finCategories = getCheckedBoxes("checkedCategories");
    assignCategories(checkedCategories, finCategories);
}

function containsAny(source,target){
    var result = source.filter(function(item){ return target.indexOf(item) > -1});
    return (result.length > 0);
}

function assignCategories(startCategories, finCategories){
    let i;
    if (finCategories == null) {
        deleteCategories(startCategories);
    } else {
        for (i = 0; i < finCategories.length; i++) {
            if (typeof startCategories !== 'undefined' && startCategories.length > 0) {
                if (containsAny(startCategories, finCategories[i])) {
                    let index = startCategories.indexOf(finCategories[i]);
                    if (index > -1) {
                        startCategories.splice(index, 1);
                    }
                    index = finCategories.indexOf(finCategories[i]);
                    if (index > -1) {
                        finCategories.splice(index, 1);
                    }
                }
                deleteCategories(startCategories);
            }
        }
        insertCategories(finCategories)
    }
}

function insertCategories(finCategories){
    let formBody = [];
    let tblidEncodedKey = encodeURIComponent("table_id");
    let tblidEncodedValue = encodeURIComponent(tbl_id);
    formBody.push(tblidEncodedKey + "=" + tblidEncodedValue);
    let catidsEncodedKey = encodeURIComponent("category_ids");
    let catidsEncodedValue = encodeURIComponent(finCategories);
    formBody.push(catidsEncodedKey + "=" + catidsEncodedValue);

    formBody = formBody.join("&");

    // Im Backend implementieren
    postData("http://localhost:8080/opendataportal-1.0-SNAPSHOT/category/addTBLCategories", formBody);
}

function deleteCategories(startCategories){
    let formBody = [];
    let tblidEncodedKey = encodeURIComponent("table_id");
    let tblidEncodedValue = encodeURIComponent(tbl_id);
    formBody.push(tblidEncodedKey + "=" + tblidEncodedValue);
    let catidsEncodedKey = encodeURIComponent("category_ids");
    let catidsEncodedValue = encodeURIComponent(startCategories);
    formBody.push(catidsEncodedKey + "=" + catidsEncodedValue);

    formBody = formBody.join("&");

    // Im Backend implementieren
    console.log("to delete")
    postData("http://localhost:8080/opendataportal-1.0-SNAPSHOT/category/deleteTBLCategories", formBody);
}
