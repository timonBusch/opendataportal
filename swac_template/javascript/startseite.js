window.onload = function () {

    /*
    data-uk-margin

     */
    var category_data = ' { "kategorien": [ "Wetterdaten", "Photovoltaik", "Wohlfühlerfasser", "Fensterzustand", "Temperaturdaten"] }';

    var cat = JSON.parse(category_data);

    for (let c in cat.kategorien) {
        let button = document.createElement("a");
        button.classList.add("uk-button");
        button.classList.add("uk-card");
        button.classList.add("uk-card-default");
        button.classList.add("uk-border-circle");
        button.href = "#";

        //leerzeile
        //let emptySpace = document.createElement("p");
        //button.appendChild(emptySpace);

        //name of category
        let category = document.createElement("p");
        category.textContent = cat.kategorien[c];
        button.appendChild(category);

        //icon of category
        //let icon = document.createElement("p");
        //button.innerHTML = "<p uk-icon=";

        /*
        if(kat.kategorien[c] == 'Wetterdaten') {

        button.innerHTML += "heart>";
        }
        */

        button.appendChild(category);

        document.body.appendChild(button);
    }


}