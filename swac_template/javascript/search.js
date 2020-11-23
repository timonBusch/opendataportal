function searchTable() {
    // Variablendeklarierung
    var input, filter, ul, ol, a, i, txtValue, countTables=0;
    input = document.getElementById('searchbar');
    filter = input.value.toUpperCase();
    ul = document.getElementById("tablelist");
    ol = ul.getElementsByTagName('ol');
    if(ol == null){
        return
    }

    // Tabellentitel nach Suchbegriff durchlaufen und entsprechend ein-/ausblenden
    for (i = 0; i < ol.length; i++) {
        a = ol[i].getElementsByTagName("h4")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            ol[i].style.display = "";
            countTables++;
        } else {
            ol[i].style.display = "none";
        }
    }
    // Anpassen der Trefferzahl
    tableNumber = document.getElementById('tableNumber');
    tableNumber.textContent = "Anzahl der Treffer: " + countTables.toString();
}
