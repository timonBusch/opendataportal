let url = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/tbl_observedobject?storage=smartmonitoring&order=DESC&countonly=false&deflatt=false"

const promiseOfSomeData =
    fetch(url)
    .then(r=>r.json())
    .then(data => {
        fetchedData = data["records"]
        console.log("in async");
        document.getElementById("tableNumber");
        tableNumber.textContent = "Anzahl der Treffer: " + data["records"].length;
        return data;
    });
window.onload = async () => {
    let someData = await promiseOfSomeJsonData;
    console.log("onload");
};