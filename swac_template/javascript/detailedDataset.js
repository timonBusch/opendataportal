
const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString)
let id = urlParams.get('id')

const url_dataset = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/data_" + id + "?storage=smartmonitoring&size=20&countonly=false&deflatt=false"
const url_dataset_count = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/data_" + id + "?storage=smartmonitoring&size=0&countonly=true&deflatt=false"
const url_dataset_keys = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/collection/data_" + id + "/getAttributes?storage=smartmonitoring"
const url_category_updateTime = "http://localhost:8080/opendataportal-1.0-SNAPSHOT/tbl_category/tbl_cat_id?tbl_cat_id=" + id

window.onload = function () {

    getData(url_dataset_count).then(data => {
        let count = data
        let number = document.getElementById("number_dataset");
        number.textContent = count.records[0].count + " Datensätze zur Verfügung";
    })

    document.getElementById("filter_attributes").addEventListener("click", filter_attributes)
    document.getElementById("export_json").addEventListener("click", exportComponentAsJson)
    document.getElementById("export_csv").addEventListener("click", exportComponentAsCSV)
    document.getElementById("comment_bt").addEventListener("click", postComment)
    document.getElementById("subscribe_bt").addEventListener("click", subscribe)

    setExample("http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/data_" + id + "?storage=smartmonitoring&size=20&countonly=false&deflatt=false")

}


/**
 * Get data from smartdata REST API
 * @param url
 * @returns {Promise<any>}
 */
async function getData(url) {
    let resonse = await fetch(url);
    return await resonse.json()
}

/**
 * Checks which boxes are checked and returnes them
 * @param chkboxName
 * @returns {[]|null}
 */
// Pass the checkbox name to the function
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

/**
 * Generates the API call to only get the selected attributes
 * @param evt
 */
function filter_attributes(){

    var checkedBoxes = getCheckedBoxes("checkAttrib")
    let component = document.getElementById("data_preview")
    let dateFrom = document.getElementById("start")
    let dateTo = document.getElementById("end")
    let correctInput = true

    component.swac_comp.removeAllData()

    let include_string = ""
    checkedBoxes.forEach(item => {
        if (include_string === ""){
            include_string += item
        }else {
            include_string += "%2C" + item
        }
    })

    // T<Stunde>3A<Minuten>3A<Sekunden>
    if(dateFrom.value !== "" && dateTo.value !== "") {
        include_string += "&filter=ts%2Cbt%2C" + dateFrom.value  + "T00%3A00%3A00" + "%2C" + dateTo.value +"T00%3A00%3A00"
    }

    // Get and check given amount
    let amoutInput = document.getElementById("data_amount")
    let size = 0
    if(isNaN(amoutInput.value) || Math.sign(amoutInput.value) === -1) {
       correctInput = false
    }else if(amoutInput.value === ""){
        size = 20

    }else if(amoutInput.value > 500) {
        correctInput = false
    }else {
        size = amoutInput.value
    }

    // Set component to filtered dataset
    if(correctInput) {

        let new_dataset_url = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/data_" + id + "?storage=smartmonitoring&includes=" + include_string + "&size=" + size + "&countonly=false&deflatt=false"
        setExample(new_dataset_url)
        getData(new_dataset_url).then(data => {
            dataset = data
            setComponentData(component)
        })

        UIkit.modal("#datasets_modal").toggle()
    }else {
        document.getElementById("data_amount").classList.add("uk-animation-shake")

        setTimeout(function (){
            document.getElementById("data_amount").classList.remove("uk-animation-shake")
        }, 1000)
    }

}

/**
 * Set the data of a component
 * @param component
 */
function setComponentData(component) {
    component.swac_comp.addData("data_preview", dataset.records)
}


/**
 * Exports a component as JSON file
 */
function exportComponentAsJson() {
    let component = document.getElementById("data_preview")
    component.swac_comp.exportJson()
}

/**
 * Exports the current state of the filtered dataset in a CSV file
 */
function exportComponentAsCSV() {

    const items = dataset.records
    const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys(items[0])
    let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    csv.unshift(header.join(','))
    csv = csv.join('\r\n')

    let dataURL = 'data:text/csv;charset=utf-8,' + csv;
    var encodedUri = encodeURI(dataURL);
    window.open(encodedUri);

}

// Call Api and set variable for SWAC components

var categories_updateTime

getData(url_category_updateTime).then(data => {
    categories_updateTime = data

})

var dataset;
getData(url_dataset).then(data =>{
    dataset = data
});

var dataset_keys;
getData(url_dataset_keys).then(data => {
    dataset_keys = data.attributes
    if(dataset_keys !== undefined) {
        for(let i =0; i < dataset_keys.length; i++) {
            if(dataset_keys[i].name === "id") {
                dataset_keys.splice(i,1)
            }
        }
        dataset_keys.sort(function (a, b) {
            if(a.name < b.name) {return -1;}
            if(a.name > b.name) {return 1}
            return 0
        })
    }

})

SWAC_reactions.addReaction(function () {

}, "exampledata")









