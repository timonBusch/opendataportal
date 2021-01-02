let caturl = "http://localhost:8080/opendataportal-1.0-SNAPSHOT/category"
var fetchedCategories = [];


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

