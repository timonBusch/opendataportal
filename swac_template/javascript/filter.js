let checked = [];
function filter(name) {
    let checkBox = document.getElementById(name);
    if (checkBox["checked"] === true) {
        checked.push(name);
    } else {
        const index = checked.indexOf(name);
        if (index > -1) {
            checked.splice(index, 1);
        }
    }
    displayResults();
}

function displayResults() {
    // Variablendeklarierung
    var category, card, ul, i, countTables=0;

    card = document.getElementById("present_example4");
    ul = card.getElementsByTagName('ul');
    if (checked.length === 0) {
        for (i = 0; i < ul.length; i++) {
            ul[i].style.display = "";
            countTables++;
        }
    } else {
        // Tabellentitel nach Suchbegriff durchlaufen und entsprechend ein-/ausblenden
        for (elem in checked) {
            for (i = 0; i < ul.length; i++) {
                category = ul[i].getElementsByClassName("cat")[0];
                if (category.innerHTML === checked[elem]) {
                    ul[i].style.display = "";
                    countTables++;
                } else {
                    ul[i].style.display = "none";
                }
            }
        }
    }
    // Anpassen der Trefferzahl

    tableNumber = document.getElementById('tableNumber');
    if(checked === ""){
        tableNumber.textContent = "Anzahl der Treffer: " + fetchedData.length;
    }else{
        tableNumber.textContent = "Anzahl der Treffer: " + countTables.toString();
    }
}
