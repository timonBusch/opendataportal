const queryString = window.location.search;
console.log(queryString)

const urlParams = new URLSearchParams(queryString)

let url_description = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/tbl_observedobject?storage=smartmonitoring&filter=id%2Ceq%2C" + urlParams.get('id') + "&size=1&page=1&countonly=false&deflatt=false"

var description_record
fetch(url_description)
    .then(response => response.json())
    .then(data => {
        description_record = data;

    });

let url_dataset = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/data_" + urlParams.get('id') + "?storage=smartmonitoring&page=1&countonly=false&deflatt=false"

var dataset
fetch(url_dataset)
    .then(response => response.json())
    .then(data =>{
        dataset = data
        let number = document.getElementById("number_dataset");
        number.textContent = dataset["records"].length + " Datensätze zur verfügung";
    });

