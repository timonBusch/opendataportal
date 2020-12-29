let searched = [];
function searchTable() {
    // Variablendeklarierung
    var input, filter, card, ul, a, i, j, txtValue;
    searched = [];

    input = document.getElementById('searchbar');
    filter = input.value.toUpperCase();
    card = document.getElementById("fetchedDatasets");
    ul = card.getElementsByTagName('ul');


    // Tabellentitel nach Suchbegriff durchlaufen und entsprechend ein-/ausblenden
    for (i = 0; i < ul.length; i++) {
        a = ul[i].getElementsByTagName("h4")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            searched.push(ul[i]);
        }
    }
    displayElements()
}

function displayElements(){
    let elements;
    if (searched.length > 0 && filter.length > 0) {
        elements = filter.filter(value => searched.includes(value));
    }
    else {
        elements = arrayUnique(filter.concat(searched));
    }
    let i, card, ul;
    card = document.getElementById("fetchedDatasets");
    ul = card.getElementsByTagName('ul');
    for (i = 0; i < ul.length; i++) {
        ul[i].style.display = "none";
    }
    for (i = 0; i < elements.length; i++) {
        elements[i].style.display = "";
    }
    tableNumber = document.getElementById('tableNumber');
    if (elements.length > fetchedData.length) {
        tableNumber.textContent = "Anzahl der Treffer: " + (elements.length-1).toString();
    } else {
        tableNumber.textContent = "Anzahl der Treffer: " + elements.length.toString();
    }

}

function arrayUnique(array) {
    var a = array.concat();
    for(var i = 0; i < a.length; ++i) {
        for(var j=i+1; j < a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}