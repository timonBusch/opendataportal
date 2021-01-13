
let id_valid = new URLSearchParams(window.location.search).get('id')

/**
 * Checks if the table contains datasets with invalid data
 */
function invalidDataExists() {
    getValid().then(data => {
        console.log(data)
        if (data.valid !== undefined && data.valid !== "") {
            document.getElementById("warning").classList.remove("uk-hidden")
        }
    }).catch(function () {
        UIkit.notification({
            message: 'Error while getting validation',
            status: 'warning',
            timeout: 5000
        });
    })
}

async function getValid() {
    let responseName = await fetch(SWAC_config.datasources[1] + "tbl_category/tbl_cat_name?tbl_cat_name=" + id_valid)
    let id = await responseName.json()
    let response = await fetch(SWAC_config.datasources[1] + "tbl/id?id=" + id.tbl_id);
    return await response.json()
}

invalidDataExists()