function addTablebox(){
    // erstmal OpenWeatherdaten, da die Schnittstelle nicht erreichbar ist
    //let url = "http://api.openweathermap.org/data/2.5/forecast?q=Augsburg,De&APPID=ca9d175f389c46b262b56ef51ef64436"
    let url = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/tbl_observedobject?storage=smartmonitoring&order=DESC&countonly=false&deflatt=false"
    fetch(url).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log("test")
        console.log(data["records"])
        var sections =  document.getElementsByClassName("tablelist");
        console.log(sections[0])
        var list = [];
        list = document.createElement("ul");
        list.setAttribute("id", "tablelist")
        for(var key in data["records"]) {
            /* Liste erstellen */
            let newTablebox = document.createElement("ol");
            let newTablediv = document.createElement("div");
            newTablediv.className="uk-box-shadow-small uk-box-shadow-hover-large uk-padding tablebox clickable uk-card uk-card-default uk-card-body"

            /* Link zur Einzelsicht */
            let clickable = document.createElement("a");
            clickable.setAttribute('href', "tabelle_details.html");
            newTablediv.appendChild(clickable);

            /* Linke Seite der Tablebox */
            let newTabledivleft = document.createElement("div");
            let newTablecontent = document.createElement("p");
            let newTableheader = document.createElement("h4");
            newTableheader.className = "uk-article-title";
            newTablecontent.className = "uk-text-lead";

            newTabledivleft.id = "table-left";
            let newTablecontenttext = document.createTextNode("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.");
            let newTablename = document.createTextNode("table_"+data["records"][key]["id"] + " - " + data["records"][key]["name"]);
            newTablecontent.appendChild(newTablecontenttext);
            newTablebox.appendChild(newTablediv);
            newTablediv.appendChild(newTabledivleft);
            newTabledivleft.appendChild(newTableheader);
            newTabledivleft.appendChild(newTablecontent);
            newTableheader.appendChild(newTablename);


            /* Rechte Seite der Tablebox */
            let newTabledivright = document.createElement("div");
            newTabledivright.id = "table-right";
            let newTablelastChange = document.createElement("p");
            let newTablelastChangeValue = document.createElement("p");
            let newTableStroge = document.createElement("p");
            let newTableStorageValue = document.createElement("p");

            let newTablelastChangeText = document.createTextNode("Letzte Änderung");
            //let newTablelastChangeValueText = document.createTextNode(data["list"][key]["dt_txt"]);
            let newTablelastChangeValueText = document.createTextNode("22.11.2020");
            newTablelastChange.appendChild(newTablelastChangeText);
            newTablelastChangeValue.appendChild(newTablelastChangeValueText);

            let newTableStorageText = document.createTextNode("Speicherplatzbedarf");
            //let newTableStorageValueText = document.createTextNode(data["list"][key]["visibility"]);
            let newTableStorageValueText = document.createTextNode("1337MB");
            newTableStroge.appendChild(newTableStorageText);
            newTableStorageValue.appendChild(newTableStorageValueText);

            newTabledivright.appendChild(newTablelastChange);
            newTabledivright.appendChild(newTablelastChangeValue);
            newTabledivright.appendChild(newTableStroge);
            newTabledivright.appendChild(newTableStorageValue);
            newTablediv.appendChild(newTabledivright);


            list.appendChild(newTablebox);
        }
        sections[0].appendChild(list);

        document.getElementById("tableNumber");
        tableNumber.textContent = "Anzahl der Treffer: " + data["records"].length;

    }).catch(function() {
        //console.log("Ein Fehler beim Abruf der Daten ist aufgetreten.");
    });
}
