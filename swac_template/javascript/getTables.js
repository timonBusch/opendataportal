let url = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/tbl_observedobject?storage=smartmonitoring&filter=datacapture%2Ceq%2Ctrue&countonly=false&deflatt=false"
var exampleoptions = {
    showWhenNoData: false,
    sortable: true
};

const promiseOfSomeJsonData =
    fetch(url)
    .then(r=>r.json())
    .then(data => {
        console.log(fetchedData)
        fetchedData = data["records"].sort(function(a,b){
            if(a.name == b.name)
                return 0;
            if(a.name < b.name)
                return -1;
            if(a.name > b.name)
                return 1;
        });
        console.log("in async");
        let tableNumber = document.getElementById("tableNumber");
        tableNumber.textContent = "Anzahl der Treffer: " + data["records"].length;
        return fetchedData;
    });

window.onload = async () => {
    let someData = await promiseOfSomeJsonData;
    console.log("onload");
    setTimeout(function (){
        displayResult(getFilterFromLS());
        sortData("asc");
    }, 1000); //vorerst Timer, weil zu langsam geladen wird. Später mit callback nach cat-fetch

};