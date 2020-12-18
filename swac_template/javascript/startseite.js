function testalert(name){
    if (name !== null){
        alert(name);
    }
}
function getCheckedBoxes(chkboxName) {
    var checkboxes = document.getElementsByName(chkboxName);
    var checkboxesChecked = [];
    // loop over them all
    for (var i=1; i<checkboxes.length; i++) {
        // And stick the checked ones onto an array...
        if (checkboxes[i].checked) {
            checkboxesChecked.push(checkboxes[i].value);
        }
    }
    // Return the array if it is non-empty, or null
    return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}

function addCategory(){
    var checkedCats = [];
    var checkedBoxes = getCheckedBoxes("checkCat");
    var catName = document.getElementById("catname").value;
    if (checkedBoxes !== null) {
        checkedBoxes.forEach(item => {
            checkedCats.push(item);
        })
    }
    console.log(catName);
    console.log(checkedCats);
}