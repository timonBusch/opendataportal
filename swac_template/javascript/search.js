function searchTable() {
    // Variablendeklarierung

    var input, filter, card, ul, a, i, txtValue, countTables=0;
    input = document.getElementById('searchbar');
    filter = input.value.toUpperCase();
    card = document.getElementById("present_example4");
    ul = card.getElementsByTagName('ul');
    if(ul == null){
        return
    }

    // Tabellentitel nach Suchbegriff durchlaufen und entsprechend ein-/ausblenden
    for (i = 0; i < ul.length; i++) {
        a = ul[i].getElementsByTagName("h4")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            ul[i].style.display = "";
            countTables++;
        } else {
            ul[i].style.display = "none";
        }
    }
    // Anpassen der Trefferzahl
    tableNumber = document.getElementById('tableNumber');
    tableNumber.textContent = "Anzahl der Treffer: " + countTables.toString();

}
