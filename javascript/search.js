let searched = [];
let doneSearch = false;

/**
 * Adds all "cards" (displayed table datasets) to the searched-array if the search term matches the title of
 * the table
 */
function searchTable() {
    var input, filter, card, ul, a, i, txtValue;
    searched = [];

    input = document.getElementById('searchbar');
    filter = input.value.toUpperCase();
    card = document.getElementById("fetchedDatasets");
    ul = card.getElementsByTagName('ul');

    for (i = 0; i < ul.length; i++) {
        a = ul[i].getElementsByTagName("h4")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            searched.push(ul[i]);
        }
    }
    doneSearch = true;
    displayElements()
}

/**
 * Displays "cards" (displayed table datasets) that matches the search term (elements in searched-array) and
 * the marked filters (elements in filtered-array)
 */
function displayElements(){
    let elements = [];
    let i, card, ul;

    if (searched.length > 0 && filtered.length > 0) {
        elements = filtered.filter(value => searched.includes(value));
    } else if (searched.length === 0 && doneSearch === false){
        let i = filtered.length;
        while(i--) elements[i] = filtered[i];
    }

    card = document.getElementById("fetchedDatasets");
    ul = card.getElementsByTagName('ul');
    for (i = 0; i < ul.length; i++) {
        ul[i].style.display = "none";
    }
    for (i = 0; i < elements.length; i++) {
        elements[i].style.display = "";
    }

    let tableNumber = document.getElementById('tableNumber');
    if (elements.length > fetchedData.length) {
        tableNumber.textContent = "Anzahl der Treffer: " + (elements.length-1).toString();
    } else {
        tableNumber.textContent = "Anzahl der Treffer: " + elements.length.toString();
    }
}