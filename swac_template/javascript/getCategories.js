let caturl = "http://localhost:8080/opendataportal-1.0-SNAPSHOT/category"
var categories = [];

function getCategories(){
    console.log("to_server");
    fetch(caturl)
        .then(r=>r.json())
        .then(data => {
            categories = data;
            return data;
        });
}

getCategories()