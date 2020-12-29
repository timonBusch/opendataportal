let searched = [];
function searchTable() {
    // Variablendeklarierung
    var input, filter, card, ul, a, i, j, txtValue, countTables=0;
    input = document.getElementById('searchbar');
    filter = input.value.toUpperCase();
    card = document.getElementById("fetchedDatasets");
    if (display.length === 0){
        ul = card.getElementsByTagName('ul');
    } else {
        j = display.length;
        ul = [];
        while(j--) ul[j] = display[j];
    }


    // Tabellentitel nach Suchbegriff durchlaufen und entsprechend ein-/ausblenden
    for (i = 0; i < ul.length; i++) {
        a = ul[i].getElementsByTagName("h4")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            ul[i].style.display = "";
            countTables++;
            searched.push(ul[i]);
        } else {
            const index = searched.indexOf(ul[i]);
            if (index > -1) {
                searched.splice(index, 1);
            }
            ul[i].style.display = "none";
        }
    }

    // Anpassen der Trefferzahl
    tableNumber = document.getElementById('tableNumber');
    if(filter == ""){
        tableNumber.textContent = "Anzahl der Treffer: " + ul.length;
    }else{
        tableNumber.textContent = "Anzahl der Treffer: " + countTables.toString();
    }

}