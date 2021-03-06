let filtered = [];

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
 * If the user comes from startpage, th filters should be resetted and the selected filter should
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
    let values = [],
        keys = Object.keys(localStorage),
        i = keys.length;
    while (i--) {
        values.push(localStorage.getItem(keys[i]));
    }
    return values;
}

/**
 * Checks if LocalStorage might have deleted categories,
 * if so, the category will be removed
 *
 * @param categoryInLS - category to check
 * @returns {boolean} - true: the category is still valid, false: there was an invalid (deleted) category
 */
function checkLS(categoryInLS){
    let categoryNames = [];
    let i = fetchedCategories.length;
    while(i--) categoryNames[i] = fetchedCategories[i]["name"];
    if (categoryNames.includes(categoryInLS.substring(6,categoryInLS.length))) {
        return true;
    } else {
        localStorage.removeItem(categoryInLS);
        return false;
    }
}

/**
 * Get all filteroptions (categories) from ls
 */
function getFilterFromLS() {
    let checkedFilter = [];
    let storage = allStorage();
    for (elem in storage){
        if (storage[elem].substring(0, 6) === "filter" && checkLS(storage[elem])){
            checkedFilter.push(storage[elem].substring(6, storage[elem].length));
            checkCheckbox(storage[elem].substring(6, storage[elem].length));
        }
    }
    return checkedFilter;
}

/**
 * Display the "tableboxes" (datasets) and the rusultcount in outline.html
 *
 * @param checkedFilter - checked filteroptions
 */
function displayResult(checkedFilter) {
    filtered = [];
    let category, card, ul, i;
    card = document.getElementById("fetchedDatasets");
    ul = card.getElementsByTagName('ul');
    if (checkedFilter.length === 0) {
        for (i = 0; i < ul.length; i++) {
            if(filtered.indexOf(ul[i]) === -1) {
                filtered.push(ul[i]);
            }
        }
    } else {
        for (elem in checkedFilter) {
            for (i = 0; i < ul.length; i++) {
                category = ul[i].getElementsByClassName("cat")[0];
                if (category.innerHTML.includes(checkedFilter[elem])) {
                    if(filtered.indexOf(ul[i]) === -1) {
                        filtered.push(ul[i]);
                    }
                }
            }
        }
    }
    displayElements()
}

/**
 * Set checkmarks for the filteroptions in outline.html
 *
 * @param checkedFilter options (categories) to check
 */
function checkCheckbox(checkedFilter) {
    let checkBox = document.getElementById(checkedFilter);
    checkBox.checked = true;
}

