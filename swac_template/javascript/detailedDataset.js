
window.onload = function () {
    getData(url_dataset_count).then(data => {
        let count = data
        let number = document.getElementById("number_dataset");
        number.textContent = count.records[0].count + " Datensätze zur Verfügung";
    })

    document.getElementById("filter_attributes").addEventListener("click", filter_attributes)
}

const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString)
let id = urlParams.get('id')

const url_description = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/tbl_observedobject?storage=smartmonitoring&filter=id%2Ceq%2C" + urlParams.get('id') + "&size=1&page=1&countonly=false&deflatt=false"
const url_dataset = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/data_" + id + "?storage=smartmonitoring&size=20&countonly=false&deflatt=false"
const url_dataset_count = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/data_" + id + "?storage=smartmonitoring&size=0&countonly=true&deflatt=false"
const url_dataset_keys = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/collection/data_" + id + "/getAttributes?storage=smartmonitoring"


async function getData(url) {
    let resonse = await fetch(url);
    return await resonse.json()
}

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

let filter_attributes = function (evt) {
    var checkedBoxes = getCheckedBoxes("checkAttrib")

    let include_string = ""
    checkedBoxes.forEach(item => {
        if (include_string === ""){
            include_string += item
        }else {
            include_string += "%2C" + item
        }
    })

    let new_dataset_url = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/data_32?storage=smartmonitoring&includes=" + include_string + "&page=2&countonly=false&deflatt=false"
    getData(new_dataset_url).then(data => {
        console.log(data)
        dataset = data
    })
    //console.log(dataset)
}


var description_record;
getData(url_description).then(data => {
    description_record = data
})

var dataset;
getData(url_dataset).then(data =>{
    dataset = data
});

var dataset_keys;
getData(url_dataset_keys).then(data => {
    dataset_keys = data
})

SWAC_reactions.addReaction(function () {

}, "exampledata")











