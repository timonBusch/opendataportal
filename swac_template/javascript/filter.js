let filter = [];

/**
 * If a filteroption is checked/unchecked the item will be added/removed from ls
 * If added: key and value have the same string ("filter"+name)
 *
 * @param name of filteroption
 */
function updateLS(name) {
    let lsname = "filter"+name;
    if (localStorage.getItem(lsname) === null) {
        localStorage.setItem(lsname, lsname);
    } else {
        localStorage.removeItem(lsname);
    }
    displayResult(getFilterFromLS());
}

/**
 * If the user comes from startpage, filters should be resetted and the selected filter should
 * operate
 */
function startfilter(name) {
    let storage = getFilterFromLS();
    for (elem in storage) {
        localStorage.removeItem("filter"+storage[elem]);
    }
    if (name !== "all"){
        let lsname = "filter"+name;
        localStorage.setItem(lsname, lsname);
    }
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
    return checkedFilter;
}

/**
 * Display the tableboxes and the rusultcount in outline.html
 *
 * @param checkedFilter - checked filteroptions
 */
function displayResult(checkedFilter) {
    filter = [];
    var category, card, ul, i, j, countTables=0;
    card = document.getElementById("fetchedDatasets");
    ul = card.getElementsByTagName('ul');
    // wenn kein Filter, alles in Display
    if (checkedFilter.length === 0) {
        for (i = 0; i < ul.length; i++) {
            if(filter.indexOf(ul[i]) === -1) {
                filter.push(ul[i]);
            }
        }
    } else {
        // wenn Filter gesetzt: für jedes Häkchen:
        for (elem in checkedFilter) {
            for (i = 0; i < ul.length; i++) {
                category = ul[i].getElementsByClassName("cat")[0];
                if (category.innerHTML.includes(checkedFilter[elem])) {
                    if(filter.indexOf(ul[i]) === -1) {
                        filter.push(ul[i]);
                    }
                }
            }
        }
    }
    console.log(filter.length)
    displayElements()
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

