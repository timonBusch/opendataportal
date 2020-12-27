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

function addCat(tbl_id, cats){
    let i;
    for (i = 0; i < fetchedCategories.length; i++) {
        if (fetchedCategories[i]["name"].includes(cats)) {
            let checkBox = document.getElementById("cat_"+fetchedCategories[i]["id"]);
            checkBox.checked = true;
        } else {
            let checkBox = document.getElementById("cat_"+fetchedCategories[i]["id"]);
            checkBox.checked = false;
        }
    }
}

