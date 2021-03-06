

let id = new URLSearchParams(window.location.search).get('id')

// Call OpenDataBackend and get table titel, update time, description

const url_category_updateTime = SWAC_config.datasources[1] + "tbl_category/tbl_cat_id?tbl_cat_id=" + id

var categories_updateTime
var table_name = ""
getData(url_category_updateTime).then(data => {
    categories_updateTime = data
    // Get table name to call on Database
    table_name = data.name
    getTableInformation()
}).catch(function () {
    UIkit.notification({
        message: 'Error while getting table details',
        status: 'warning',
        timeout: 5000
    });
})

window.onload = function () {

    getTableCount()

    document.getElementById("filter_attributes").addEventListener("click", filter_attributes)
    document.getElementById("export_json").addEventListener("click", exportComponentAsJson)
    document.getElementById("export_csv").addEventListener("click", exportComponentAsCSV)
    document.getElementById("comment_bt").addEventListener("click", postComment)
    document.getElementById("subscribe_bt").addEventListener("click", subscribe)

    setExample(SWAC_config.datasources[3] + "/smartdata/records/" + id + "?storage=smartmonitoring&size=20&countonly=false&deflatt=false")

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

        let new_dataset_url = SWAC_config.datasources[3] + "/smartdata/records/" + table_name + "?storage=smartmonitoring&includes=" + include_string + "&size=" + size + "&countonly=false&deflatt=false"
        setExample(new_dataset_url)
        getData(new_dataset_url).then(data => {
            dataset = data
            setComponentData(component, dataset.records)
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
 * @param component_name
 * @param component
 */
function setComponentData(component_name, component) {
    component_name.swac_comp.addData("data_preview", component)
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

/**
 * Calls REST API and set dataset count
 */
function getTableCount() {
    const url_dataset_count = SWAC_config.datasources[3] + "/smartdata/records/" + table_name + "?storage=smartmonitoring&size=0&countonly=true&deflatt=false"

    getData(url_dataset_count).then(data => {
        let count = data
        let number = document.getElementById("number_dataset");
        number.textContent = count.records[0].count + " Datens??tze zur Verf??gung";
    }).catch(function () {
        UIkit.notification({
            message: 'Error while getting count',
            status: 'warning',
            timeout: 5000
        });
    })
}


var dataset;
var dataset_keys;

/**
 * Calls REST API gets informatione for data preview and the data keys
 */
function getTableInformation() {
    const url_dataset = SWAC_config.datasources[3] + "/smartdata/records/" + table_name + "?storage=smartmonitoring&size=20&countonly=false&deflatt=false"


    getData(url_dataset).then(data =>{
        dataset = data
    }).catch(function () {
        UIkit.notification({
            message: 'Error while getting datasets',
            status: 'warning',
            timeout: 5000
        });
    });

    const url_dataset_keys = SWAC_config.datasources[3] + "/smartdata/collection/" + table_name + "/getAttributes?storage=smartmonitoring"


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

    }).catch(function () {
        UIkit.notification({
            message: 'Error while getting datakeys',
            status: 'warning',
            timeout: 5000
        });
    })
}

// Remove all data from components and set them again

SWAC_reactions.addReaction(function () {
    let data_preview_component = document.getElementById("data_preview")
    let present_attributes_component = document.getElementById("present_attributes")
    data_preview_component.swac_comp.removeAllData()
    present_attributes_component.swac_comp.removeAllData()
    setComponentData(data_preview_component, dataset.records)
    setComponentData(data_preview_component, dataset_keys)
}, "categories_updateTime")









