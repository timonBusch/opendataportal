
window.onload = function () {
    getData(url_dataset_count).then(data => {
        let count = data
        let number = document.getElementById("number_dataset");
        number.textContent = count.records[0].count + " Datensätze zur Verfügung";
    })
}

const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString)
let id = urlParams.get('id')

const url_description = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/tbl_observedobject?storage=smartmonitoring&filter=id%2Ceq%2C" + urlParams.get('id') + "&size=1&page=1&countonly=false&deflatt=false"
const url_dataset = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/data_" + id + "?storage=smartmonitoring&page=2&countonly=false&deflatt=false"
const url_dataset_count = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/data_" + id + "?storage=smartmonitoring&size=0&countonly=true&deflatt=false"
const url_dataset_keys = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/collection/data_" + id + "/getAttributes?storage=smartmonitoring"


async function getData(url) {
    let resonse = await fetch(url);
    return await resonse.json()
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







