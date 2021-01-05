
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
    })
}

async function getValid() {
    let response = await fetch("http://localhost:8080/opendataportal-1.0-SNAPSHOT/tbl/id?id=" + id_valid);
    return await response.json()
}

invalidDataExists()