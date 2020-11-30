const queryString = window.location.search;
console.log(queryString)

const urlParams = new URLSearchParams(queryString)

let url = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/tbl_observedobject?storage=smartmonitoring&filter=id%2Ceq%2C" + urlParams.get('id') + "&size=1&page=1&countonly=false&deflatt=false"

var records

fetch(url)
    .then(response => response.json())
    .then(data => records = data);



