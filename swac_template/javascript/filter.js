/**
 * If a filteroption is checked/unchecked the item will be added/removed from ls
 * If added: key and value have the same string ("filter"+name)
 *
 * @param name of filteroption
 */
function filter(name) {
    let lsname = "filter"+name;
    if (localStorage.getItem(lsname) === null) {
        localStorage.setItem(lsname, lsname);
    } else {
        localStorage.removeItem(lsname);
    }
    getFilterFromLS();
}

/**
 * Get the values from all items in storage
 *
 * @returns list of items in storage
 */
function allStorage() {
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;
    while (i--) {
        values.push(localStorage.getItem(keys[i]));
    }
    return values;
}

/**
 * Get all filteroptions from ls
 */
function getFilterFromLS() {
    let checkedFilter = [];
    let storage = allStorage();
    for (elem in storage){
        if (storage[elem].substring(0, 6) === "filter"){
            checkedFilter.push(storage[elem].substring(6, storage[elem].length));
            checkCheckbox(storage[elem].substring(6, storage[elem].length))
        }
    }
    displayResult(checkedFilter)
}

/**
 * Display the tableboxes and the rusultcount in outline.html
 *
 * @param checkedFilter - checked filteroptions
 */
function displayResult(checkedFilter) {
    var category, card, ul, i, countTables=0;
    let display = [];
    card = document.getElementById("fetchedDatasets");
    ul = card.getElementsByTagName('ul');
    if (checkedFilter.length === 0) {
        for (i = 0; i < ul.length; i++) {
            ul[i].style.display = "";
            if (i < ul.length-1){
                countTables++;
            }
        }
    } else {
        for (elem in checkedFilter) {
            for (i = 0; i < ul.length; i++) {
                category = ul[i].getElementsByClassName("cat")[0];
                if (category.innerHTML === checkedFilter[elem]) {
                    display.push(ul[i]);
                }
                ul[i].style.display = "none";
            }
        }
        for (elem in display) {
            ul[elem].style.display = "";
            if (elem < display.length -1) {
                countTables++;
            }
        }
    }

    tableNumber = document.getElementById('tableNumber');
    if(checkedFilter === "") {
        tableNumber.textContent = "Anzahl der Treffer: " + fetchedData.length;
    } else{
        tableNumber.textContent = "Anzahl der Treffer: " + countTables.toString();
    }
}

/**
 * Check filteroptions in outline.html
 *
 * @param checkedFilter
 */
function checkCheckbox(checkedFilter) {
    let checkBox = document.getElementById(checkedFilter);
    checkBox.checked = true;
}